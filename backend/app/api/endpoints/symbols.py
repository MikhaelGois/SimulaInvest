from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.yahoo_service import YahooService
from app.services.investidor10_service import Investidor10Service
from app.services.status_invest_service import StatusInvestService

router = APIRouter()

@router.get("/quote/{ticker}")
def get_quote(ticker: str, db: Session = Depends(get_db)):
    """
    Get consolidated quote data from multiple sources:
    - Yahoo Finance (price, currency, market cap)
    - Investidor10 (fundamentals, ratings)
    - Status Invest (detailed metrics, analyst recommendations)
    """
    # Normalizar ticker
    if not ticker.endswith('.SA'):
        ticker_sa = f"{ticker}.SA"
    else:
        ticker_sa = ticker
    ticker_clean = ticker.replace('.SA', '')
    
    # Fetch from all sources
    yahoo_data = YahooService.get_quote(ticker_clean)
    investidor10_data = Investidor10Service.get_stock_data(ticker_clean)
    status_invest_data = StatusInvestService.get_stock_data(ticker_clean)
    
    # Consolidar preço (prioridade: Yahoo > Status > Investidor10)
    price = None
    if yahoo_data and yahoo_data.get('price'):
        price = yahoo_data['price']
    elif status_invest_data and status_invest_data.get('price'):
        price = status_invest_data['price']
    elif investidor10_data and investidor10_data.get('price'):
        price = investidor10_data['price']
    
    # Consolidar dividend yield
    dividend_yield = None
    if yahoo_data and yahoo_data.get('dividend_yield'):
        dividend_yield = yahoo_data['dividend_yield']
    elif investidor10_data and investidor10_data.get('dividend_yield'):
        dividend_yield = investidor10_data['dividend_yield']
    elif status_invest_data and status_invest_data.get('dividend_yield'):
        dividend_yield = status_invest_data['dividend_yield']
    
    # Calcular variação percentual (se disponível)
    change_percent = None
    if yahoo_data and 'change_percent' in yahoo_data:
        change_percent = yahoo_data['change_percent']
    
    consolidated = {
        "ticker": ticker_clean,
        "price": price,
        "change_percent": change_percent,
        "dividend_yield": dividend_yield,
        "currency": yahoo_data.get('currency') if yahoo_data else 'BRL',
        "yahoo": yahoo_data,
        "investidor10": investidor10_data,
        "status_invest": status_invest_data,
        "links": {
            "google_finance": f"https://www.google.com/finance/quote/{ticker_clean}:BVMF",
            "yahoo_finance": f"https://finance.yahoo.com/quote/{ticker_sa}",
            "investidor10": f"https://www.investidor10.com.br/acoes/{ticker_clean}/",
            "status_invest": f"https://www.statusinvest.com.br/acoes/{ticker_clean}"
        }
    }
    
    if not any([yahoo_data, investidor10_data, status_invest_data]):
        return {"error": "Quote not found in any source", "ticker": ticker_clean}
    
    return consolidated

@router.get("/search")
def search(q: str, db: Session = Depends(get_db)):
    """
    Search stocks across multiple sources
    """
    yahoo_results = YahooService.search_tickers(q)
    investidor10_results = Investidor10Service.search_stocks(q)
    status_invest_results = StatusInvestService.search_stocks(q)
    
    # Combine and deduplicate results
    all_results = []
    seen_tickers = set()
    
    for results in [yahoo_results, investidor10_results, status_invest_results]:
        if results:
            for result in results:
                ticker = result.get("ticker", "").upper()
                if ticker and ticker not in seen_tickers:
                    seen_tickers.add(ticker)
                    all_results.append(result)
    
    return {"results": all_results}

@router.get("/fii/{ticker}")
def get_fii(ticker: str, db: Session = Depends(get_db)):
    """
    Get FII (Fundo de Investimento Imobiliário) data from multiple sources
    """
    investidor10_data = Investidor10Service.get_fii_data(ticker)
    status_invest_data = StatusInvestService.get_fii_data(ticker)
    
    consolidated = {
        "ticker": ticker,
        "type": "FII",
        "sources": {
            "investidor10": investidor10_data,
            "status_invest": status_invest_data,
        },
        "links": {
            "google_finance": f"https://www.google.com/finance/quote/{ticker.replace('.SA', '')}:BVMF",
            "investidor10": f"https://www.investidor10.com.br/fiis/{ticker.replace('.SA', '')}/",
            "status_invest": f"https://www.statusinvest.com.br/fiis/{ticker.replace('.SA', '')}"
        }
    }
    
    if not any([investidor10_data, status_invest_data]):
        return {"error": "FII not found"}
    
    return consolidated
