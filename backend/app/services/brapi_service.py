"""
Serviço de integração com brapi.dev
API de cotações, fundamentos e dados brasileiros
Documentação: https://brapi.dev
"""
import logging
import httpx
import asyncio
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from decimal import Decimal

from app.core.config import settings

logger = logging.getLogger(__name__)


class BrapiService:
    """Integração com brapi.dev"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.BRAPI_KEY
        self.base_url = settings.BRAPI_BASE_URL
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
    
    async def get_quote(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Obter cotação atual de um ticker
        Retorna: open, high, low, close, volume, etc.
        """
        try:
            client = await self.get_session()
            url = f"{self.base_url}/quote/{ticker}"
            params = {}
            if self.api_key:
                params["token"] = self.api_key
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if data.get("results"):
                return data["results"][0]
            return None
        except Exception as e:
            logger.error(f"Erro ao buscar cotação {ticker}: {e}")
            return None
    
    async def get_quotes_batch(self, tickers: List[str]) -> Dict[str, Any]:
        """
        Obter cotações de múltiplos tickers
        brapi.dev permite até 10 tickers por request separados por comma
        """
        try:
            client = await self.get_session()
            
            # Dividir em chunks de 10
            results = {}
            for i in range(0, len(tickers), 10):
                batch = tickers[i:i+10]
                ticker_str = ",".join(batch)
                
                url = f"{self.base_url}/quote/{ticker_str}"
                params = {}
                if self.api_key:
                    params["token"] = self.api_key
                
                response = await client.get(url, params=params)
                response.raise_for_status()
                
                data = response.json()
                if data.get("results"):
                    for quote in data["results"]:
                        results[quote.get("symbol")] = quote
                
                # Rate limit: esperar um pouco entre requests
                await asyncio.sleep(0.5)
            
            return results
        except Exception as e:
            logger.error(f"Erro ao buscar batch de cotações: {e}")
            return {}
    
    async def get_historical_quotes(
        self,
        ticker: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> List[Dict[str, Any]]:
        """
        Obter histórico de cotações
        brapi.dev fornece histórico apenas com token premium
        Alternativa: usar yahoo_finance para histórico
        """
        try:
            client = await self.get_session()
            
            # Parâmetros
            params = {}
            if self.api_key:
                params["token"] = self.api_key
            
            if start_date:
                params["range"] = "1d"  # Pode ser: 1d, 5d, 1mo, etc
            
            url = f"{self.base_url}/quote/{ticker}"
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if data.get("results"):
                return data["results"]
            return []
        except Exception as e:
            logger.error(f"Erro ao buscar histórico {ticker}: {e}")
            return []
    
    async def get_fundamentals(self, ticker: str) -> Optional[Dict[str, Any]]:
        """
        Obter dados fundamentalistas de uma ação
        brapi.dev fornece: ROE, ROIC, margem, P/E, P/B, etc (requer token)
        """
        try:
            client = await self.get_session()
            
            url = f"{self.base_url}/quote/{ticker}"
            params = {}
            if self.api_key:
                params["token"] = self.api_key
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if data.get("results"):
                result = data["results"][0]
                # Extrair dados fundamentalistas se disponíveis
                return {
                    "ticker": result.get("symbol"),
                    "pe": result.get("p_e"),
                    "pb": result.get("p_b"),
                    "pvpa": result.get("p_vpa"),
                    "dy": result.get("dividend_yield"),
                    "roe": result.get("roe"),
                    "roic": result.get("roic"),
                }
            return None
        except Exception as e:
            logger.error(f"Erro ao buscar fundamentals {ticker}: {e}")
            return None
    
    async def search(self, query: str) -> List[Dict[str, str]]:
        """
        Buscar ativos pelo nome/ticker
        Retorna lista de ativos que combinam com a busca
        """
        try:
            client = await self.get_session()
            
            url = f"{self.base_url}/quote"
            params = {"search": query}
            if self.api_key:
                params["token"] = self.api_key
            
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if data.get("results"):
                return [
                    {
                        "ticker": r.get("symbol"),
                        "name": r.get("shortName"),
                        "type": r.get("type"),
                    }
                    for r in data["results"]
                ]
            return []
        except Exception as e:
            logger.error(f"Erro ao buscar {query}: {e}")
            return []


# Singleton
_brapi_instance: Optional[BrapiService] = None


def get_brapi_service() -> BrapiService:
    """Obter instância singleton do serviço brapi"""
    global _brapi_instance
    if _brapi_instance is None:
        _brapi_instance = BrapiService()
    return _brapi_instance


async def brapi_sync_quotes(tickers: List[str], db_session) -> Dict[str, Any]:
    """
    Sincronizar cotações de múltiplos tickers com o banco
    
    Retorna:
        {
            "success": 10,
            "failed": 0,
            "errors": []
        }
    """
    from app.models.orm import AssetModel, QuoteModel
    from sqlalchemy import and_
    
    service = get_brapi_service()
    result = {"success": 0, "failed": 0, "errors": []}
    
    try:
        # Buscar cotações
        quotes_data = await service.get_quotes_batch(tickers)
        
        for ticker, quote in quotes_data.items():
            try:
                # Verificar se ativo existe
                asset = db_session.query(AssetModel).filter(
                    AssetModel.ticker == ticker.upper()
                ).first()
                
                if not asset:
                    logger.warning(f"Ativo {ticker} não existe no BD")
                    result["failed"] += 1
                    continue
                
                # Extrair dados
                date_str = quote.get("timestamp")
                if not date_str:
                    date_str = datetime.utcnow().isoformat()
                
                open_price = Decimal(str(quote.get("open", 0)))
                high = Decimal(str(quote.get("high", 0)))
                low = Decimal(str(quote.get("low", 0)))
                close = Decimal(str(quote.get("close", 0)))
                volume = quote.get("volume", 0)
                
                # Verificar se cotação já existe para este dia
                date_obj = datetime.fromisoformat(date_str) if isinstance(date_str, str) else date_str
                existing = db_session.query(QuoteModel).filter(
                    and_(
                        QuoteModel.asset_id == asset.id,
                        QuoteModel.date == date_obj.date()
                    )
                ).first()
                
                if existing:
                    # Atualizar
                    existing.open = open_price
                    existing.high = high
                    existing.low = low
                    existing.close = close
                    existing.volume = volume
                else:
                    # Criar nova
                    quote_model = QuoteModel(
                        asset_id=asset.id,
                        date=date_obj,
                        open=open_price,
                        high=high,
                        low=low,
                        close=close,
                        volume=volume,
                    )
                    db_session.add(quote_model)
                
                result["success"] += 1
            except Exception as e:
                logger.error(f"Erro ao sincronizar {ticker}: {e}")
                result["failed"] += 1
                result["errors"].append(str(e))
        
        db_session.commit()
        logger.info(f"Sincronização concluída: {result['success']} sucesso, {result['failed']} falhas")
    except Exception as e:
        logger.error(f"Erro geral na sincronização: {e}")
        result["errors"].append(str(e))
        db_session.rollback()
    finally:
        await service.close()
    
    return result
