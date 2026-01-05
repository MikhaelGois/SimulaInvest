"""
Serviço de integração com CVM Dados Abertos
Extrai informações de empresas, fundamentos e documentos
Portal: https://dados.cvm.gov.br
"""
import logging
import httpx
from datetime import datetime
from typing import Optional, List, Dict, Any
from decimal import Decimal

logger = logging.getLogger(__name__)


class CVMService:
    """Integração com CVM Dados Abertos (sem autenticação)"""
    
    # API endpoints públicos da CVM
    BASE_URL = "https://dados.cvm.gov.br/api"
    
    def __init__(self):
        self.session = None
    
    async def get_session(self) -> httpx.AsyncClient:
        """Obter sessão async do httpx"""
        if not self.session:
            self.session = httpx.AsyncClient(timeout=30.0)
        return self.session
    
    async def close(self):
        """Fechar sessão"""
        if self.session:
            await self.session.aclose()
    
    async def search_company(self, cnpj: str) -> Optional[Dict[str, Any]]:
        """
        Buscar empresa pelo CNPJ
        Retorna: razão social, setor, data constituição, etc.
        """
        try:
            client = await self.get_session()
            
            # Endpoint para buscar empresa por CNPJ
            url = f"{self.BASE_URL}/cgi/mostracompanhia"
            params = {
                "cnpj": cnpj,
                "formato": "json",
            }
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            return data
        except Exception as e:
            logger.error(f"Erro ao buscar empresa {cnpj}: {e}")
            return None
    
    async def get_fundamentals(self, cnpj: str) -> Optional[Dict[str, Any]]:
        """
        Obter dados fundamentalistas de uma empresa
        Extrai de demonstrações financeiras depositadas na CVM
        
        Retorna:
        - Receita bruta
        - EBITDA
        - Lucro líquido
        - Patrimônio líquido
        - Endividamento
        """
        try:
            client = await self.get_session()
            
            # Endpoint para buscar dados financeiros (pode variar)
            url = f"{self.BASE_URL}/cgi/dfp"
            params = {
                "cnpj": cnpj,
                "formato": "json",
            }
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            return data
        except Exception as e:
            logger.error(f"Erro ao buscar fundamentals {cnpj}: {e}")
            return None
    
    async def search_by_ticker(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Buscar empresa pelo ticker (ex: PETR4)
        Note: CVM usa CNPJ, não ticker. Este método busca por nome.
        """
        try:
            client = await self.get_session()
            
            # Busca por nome da empresa (ticker está geralmente no nome)
            url = f"{self.BASE_URL}/cgi/listacompanhias"
            params = {
                "nome": ticker,
                "formato": "json",
            }
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                return data[0]  # Retorna primeira correspondência
            return None
        except Exception as e:
            logger.error(f"Erro ao buscar ticker {ticker}: {e}")
            return None
    
    async def list_companies(self, limit: int = 100) -> Optional[List[Dict[str, Any]]]:
        """
        Listar todas as companhias (paginated)
        """
        try:
            client = await self.get_session()
            
            url = f"{self.BASE_URL}/cgi/listacompanhias"
            params = {
                "formato": "json",
                "limit": limit,
            }
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            return data if isinstance(data, list) else [data]
        except Exception as e:
            logger.error(f"Erro ao listar companhias: {e}")
            return None


# Singleton
_cvm_instance: Optional[CVMService] = None


def get_cvm_service() -> CVMService:
    """Obter instância singleton do serviço CVM"""
    global _cvm_instance
    if _cvm_instance is None:
        _cvm_instance = CVMService()
    return _cvm_instance


async def cvm_sync_fundamentals(tickers: List[str], db_session) -> Dict[str, Any]:
    """
    Sincronizar dados fundamentalistas do CVM com o banco
    
    Nota: CVM usa CNPJ, então este método requer mapeamento ticker -> CNPJ
    
    Retorna:
        {
            "success": 5,
            "failed": 0,
            "errors": []
        }
    """
    from app.models.orm import AssetModel, ValuationModel
    
    service = get_cvm_service()
    result = {"success": 0, "failed": 0, "errors": []}
    
    try:
        for ticker in tickers:
            try:
                # Verificar se ativo existe
                asset = db_session.query(AssetModel).filter(
                    AssetModel.ticker == ticker.upper()
                ).first()
                
                if not asset:
                    logger.warning(f"Ativo {ticker} não existe no BD")
                    result["failed"] += 1
                    continue
                
                # Buscar dados da CVM (por ticker/nome)
                company_data = await service.search_by_ticker(ticker)
                
                if not company_data:
                    logger.warning(f"Dados CVM não encontrados para {ticker}")
                    result["failed"] += 1
                    continue
                
                # Extrair fundamentos (pode variar conforme API)
                # Este é um template genérico
                roe = company_data.get("roe")
                roic = company_data.get("roic")
                ebitda_margin = company_data.get("ebitda_margin")
                debt_ebitda = company_data.get("debt_ebitda")
                revenue_growth = company_data.get("revenue_growth")
                
                # Converter para Decimal se existir
                try:
                    if roe:
                        roe = Decimal(str(roe))
                    if roic:
                        roic = Decimal(str(roic))
                    if ebitda_margin:
                        ebitda_margin = Decimal(str(ebitda_margin))
                    if debt_ebitda:
                        debt_ebitda = Decimal(str(debt_ebitda))
                    if revenue_growth:
                        revenue_growth = Decimal(str(revenue_growth))
                except Exception as e:
                    logger.warning(f"Erro ao converter dados: {e}")
                
                # Verificar se valuation existe
                existing = db_session.query(ValuationModel).filter(
                    ValuationModel.asset_id == asset.id
                ).first()
                
                if existing:
                    # Atualizar
                    existing.roe = roe
                    existing.roic = roic
                    existing.ebitda_margin = ebitda_margin
                    existing.debt_ebitda = debt_ebitda
                    existing.revenue_growth = revenue_growth
                    existing.updated_at = datetime.utcnow()
                else:
                    # Criar novo
                    valuation = ValuationModel(
                        asset_id=asset.id,
                        roe=roe,
                        roic=roic,
                        ebitda_margin=ebitda_margin,
                        debt_ebitda=debt_ebitda,
                        revenue_growth=revenue_growth,
                    )
                    db_session.add(valuation)
                
                result["success"] += 1
            except Exception as e:
                logger.error(f"Erro ao sincronizar fundamentos {ticker}: {e}")
                result["failed"] += 1
                result["errors"].append(str(e))
        
        db_session.commit()
        logger.info(f"Sincronização CVM concluída: {result['success']} sucesso, {result['failed']} falhas")
    except Exception as e:
        logger.error(f"Erro geral na sincronização CVM: {e}")
        result["errors"].append(str(e))
        db_session.rollback()
    finally:
        await service.close()
    
    return result
