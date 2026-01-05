"""
Serviço de integração com ANBIMA
API de títulos públicos e renda fixa
Documentação: https://developers.anbima.com.br
"""
import logging
import httpx
from datetime import datetime
from typing import Optional, List, Dict, Any
from decimal import Decimal

from app.core.config import settings

logger = logging.getLogger(__name__)


class AnbimaService:
    """Integração com ANBIMA API"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.ANBIMA_KEY
        self.base_url = settings.ANBIMA_BASE_URL
        self.session = None
    
    async def get_session(self) -> httpx.AsyncClient:
        """Obter sessão async do httpx"""
        if not self.session:
            headers = {}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
            self.session = httpx.AsyncClient(headers=headers, timeout=30.0)
        return self.session
    
    async def close(self):
        """Fechar sessão"""
        if self.session:
            await self.session.aclose()
    
    async def get_treasury_rates(self) -> Optional[List[Dict[str, Any]]]:
        """
        Obter taxas de Tesouro Direto
        Retorna lista com: código, tipo, vencimento, taxa de compra/venda, PU, VNA
        
        Tipos: Selic, IPCA, Prefixado
        """
        try:
            client = await self.get_session()
            
            # Endpoint de títulos públicos (ANBIMA)
            url = f"{self.base_url}/public_bonds/rates"
            
            response = await client.get(url)
            response.raise_for_status()
            
            data = response.json()
            if data.get("data"):
                return data["data"]
            return []
        except Exception as e:
            logger.error(f"Erro ao buscar taxas ANBIMA: {e}")
            return None
    
    async def get_treasury_by_code(self, codigo: str) -> Optional[Dict[str, Any]]:
        """
        Obter detalhes de um título específico pelo código
        Exemplo: "00380551" (Tesouro IPCA+ 2035)
        """
        try:
            client = await self.get_session()
            
            url = f"{self.base_url}/public_bonds/rates/{codigo}"
            
            response = await client.get(url)
            response.raise_for_status()
            
            data = response.json()
            if data.get("data"):
                return data["data"]
            return None
        except Exception as e:
            logger.error(f"Erro ao buscar título {codigo}: {e}")
            return None
    
    async def get_treasury_history(
        self,
        codigo: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> Optional[List[Dict[str, Any]]]:
        """
        Obter histórico de taxas e PUs de um título
        Formato de data: YYYY-MM-DD
        """
        try:
            client = await self.get_session()
            
            url = f"{self.base_url}/public_bonds/history/{codigo}"
            params = {}
            
            if start_date:
                params["from"] = start_date
            if end_date:
                params["to"] = end_date
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if data.get("data"):
                return data["data"]
            return []
        except Exception as e:
            logger.error(f"Erro ao buscar histórico {codigo}: {e}")
            return None
    
    async def get_fixed_income_by_type(self, tipo: str) -> Optional[List[Dict[str, Any]]]:
        """
        Obter todos os títulos de um tipo específico
        
        Tipos:
        - "selic"       → Tesouro Selic
        - "ipca"        → Tesouro IPCA+
        - "prefixado"   → Tesouro Prefixado
        """
        try:
            client = await self.get_session()
            
            # Filtrar por tipo (pode variar conforme API)
            url = f"{self.base_url}/public_bonds/rates"
            params = {"type": tipo}
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if data.get("data"):
                return data["data"]
            return []
        except Exception as e:
            logger.error(f"Erro ao buscar títulos tipo {tipo}: {e}")
            return None


# Singleton
_anbima_instance: Optional[AnbimaService] = None


def get_anbima_service() -> AnbimaService:
    """Obter instância singleton do serviço ANBIMA"""
    global _anbima_instance
    if _anbima_instance is None:
        _anbima_instance = AnbimaService()
    return _anbima_instance


async def anbima_sync_titles(db_session) -> Dict[str, Any]:
    """
    Sincronizar títulos públicos do ANBIMA com o banco
    
    Retorna:
        {
            "success": 20,
            "failed": 0,
            "errors": []
        }
    """
    from app.models.orm import FixedIncomeModel
    from sqlalchemy import and_
    
    service = get_anbima_service()
    result = {"success": 0, "failed": 0, "errors": []}
    
    try:
        # Buscar todos os títulos
        titles = await service.get_treasury_rates()
        
        if not titles:
            logger.warning("Nenhum título retornado pela ANBIMA")
            result["errors"].append("API ANBIMA não retornou dados")
            return result
        
        for title in titles:
            try:
                codigo = title.get("code") or title.get("codigo")
                if not codigo:
                    logger.warning(f"Título sem código: {title}")
                    continue
                
                # Verificar se existe
                existing = db_session.query(FixedIncomeModel).filter(
                    FixedIncomeModel.codigo_tesoureiro == codigo
                ).first()
                
                # Extrair dados
                nome = title.get("name") or title.get("nome")
                tipo = title.get("type") or title.get("tipo")
                maturity = title.get("maturity_date") or title.get("vencimento")
                taxa_compra = title.get("buy_rate") or title.get("taxa_compra")
                taxa_venda = title.get("sell_rate") or title.get("taxa_venda")
                pu_bd = title.get("buy_pu") or title.get("pu_compra")
                pu_pf = title.get("sell_pu") or title.get("pu_venda")
                vna = title.get("vna") or title.get("vna_atual")
                
                # Converter para Decimal e datetime
                try:
                    if taxa_compra:
                        taxa_compra = Decimal(str(taxa_compra))
                    if taxa_venda:
                        taxa_venda = Decimal(str(taxa_venda))
                    if pu_bd:
                        pu_bd = Decimal(str(pu_bd))
                    if pu_pf:
                        pu_pf = Decimal(str(pu_pf))
                    if vna:
                        vna = Decimal(str(vna))
                    
                    if isinstance(maturity, str):
                        maturity = datetime.fromisoformat(maturity)
                except Exception as e:
                    logger.warning(f"Erro ao converter dados: {e}")
                
                if existing:
                    # Atualizar
                    existing.name = nome
                    existing.tipo = tipo
                    existing.maturity_date = maturity
                    existing.taxa_compra = taxa_compra
                    existing.taxa_venda = taxa_venda
                    existing.pu_bd = pu_bd
                    existing.pu_pf = pu_pf
                    existing.vna_atual = vna
                else:
                    # Criar novo
                    title_model = FixedIncomeModel(
                        codigo_tesoureiro=codigo,
                        name=nome,
                        tipo=tipo,
                        maturity_date=maturity,
                        taxa_compra=taxa_compra,
                        taxa_venda=taxa_venda,
                        pu_bd=pu_bd,
                        pu_pf=pu_pf,
                        vna_atual=vna,
                    )
                    db_session.add(title_model)
                
                result["success"] += 1
            except Exception as e:
                logger.error(f"Erro ao sincronizar título {codigo}: {e}")
                result["failed"] += 1
                result["errors"].append(str(e))
        
        db_session.commit()
        logger.info(f"Sincronização ANBIMA concluída: {result['success']} sucesso, {result['failed']} falhas")
    except Exception as e:
        logger.error(f"Erro geral na sincronização ANBIMA: {e}")
        result["errors"].append(str(e))
        db_session.rollback()
    finally:
        await service.close()
    
    return result
