import yfinance as yf
from typing import Optional, Dict

class YahooService:
    @staticmethod
    def get_quote(ticker: str) -> Optional[Dict]:
        try:
            # Add .SA suffix for B3 tickers if not already present
            if not ticker.endswith(".SA") and len(ticker) <= 4:
                ticker = f"{ticker}.SA"
            
            data = yf.Ticker(ticker)
            info = data.info
            
            return {
                "ticker": ticker,
                "price": info.get("currentPrice") or info.get("regularMarketPrice"),
                "name": info.get("longName"),
                "currency": info.get("currency"),
                "market_cap": info.get("marketCap"),
                "dividend_yield": info.get("dividendYield"),
            }
        except Exception as e:
            print(f"Error fetching quote for {ticker}: {e}")
            return None

    @staticmethod
    def search_tickers(query: str) -> list:
        try:
            # Search using yfinance
            # This is a simplified approach - consider using a more robust search API
            results = yf.Ticker(query)
            if results.info.get("longName"):
                return [{
                    "ticker": query,
                    "name": results.info.get("longName"),
                    "type": results.info.get("quoteType")
                }]
            return []
        except Exception as e:
            print(f"Error searching for {query}: {e}")
            return []
