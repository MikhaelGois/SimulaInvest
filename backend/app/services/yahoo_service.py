import yfinance as yf
from typing import Optional, Dict

class YahooService:
    @staticmethod
    def get_quote(ticker: str) -> Optional[Dict]:
        try:
            # Add .SA suffix for B3 tickers if not already present
            if not ticker.endswith(".SA"):
                ticker = f"{ticker}.SA"
            
            data = yf.Ticker(ticker)
            info = data.info
            
            # Obter preço atual
            current_price = info.get("currentPrice") or info.get("regularMarketPrice")
            
            # Calcular variação percentual
            change_percent = info.get("regularMarketChangePercent")
            if change_percent is None and info.get("regularMarketChange") and current_price:
                # Calcular manualmente se não estiver disponível
                prev_close = info.get("previousClose")
                if prev_close and prev_close > 0:
                    change_percent = ((current_price - prev_close) / prev_close) * 100
            
            return {
                "ticker": ticker.replace('.SA', ''),
                "price": current_price,
                "name": info.get("longName"),
                "currency": info.get("currency"),
                "market_cap": info.get("marketCap"),
                "dividend_yield": info.get("dividendYield"),
                "change_percent": change_percent,
                "previous_close": info.get("previousClose"),
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
