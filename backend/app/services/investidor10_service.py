import requests
from typing import Optional, Dict
from bs4 import BeautifulSoup
import json

class Investidor10Service:
    BASE_URL = "https://www.investidor10.com.br"
    
    @staticmethod
    def get_stock_data(ticker: str) -> Optional[Dict]:
        """
        Fetch stock data from Investidor10
        """
        try:
            # Remove .SA if present for Investidor10 API
            clean_ticker = ticker.replace(".SA", "")
            
            # Try to fetch from Investidor10 API or website
            url = f"{Investidor10Service.BASE_URL}/api/quote/{clean_ticker}"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "source": "investidor10",
                    "ticker": clean_ticker,
                    "price": data.get("price"),
                    "pe_ratio": data.get("peRatio"),
                    "dividend_yield": data.get("dividendYield"),
                    "roe": data.get("roe"),
                    "net_margin": data.get("netMargin"),
                    "debt_ratio": data.get("debtRatio"),
                    "growth_rate": data.get("growthRate"),
                    "recommendation": data.get("recommendation"),
                    "rating": data.get("rating"),
                }
            
            # Fallback: return minimal data indicating source is available
            return {
                "source": "investidor10",
                "ticker": clean_ticker,
                "link": f"{Investidor10Service.BASE_URL}/acoes/{clean_ticker}/",
                "note": "Detailed data available on Investidor10"
            }
            
        except Exception as e:
            print(f"Error fetching Investidor10 data for {ticker}: {e}")
            return None

    @staticmethod
    def search_stocks(query: str) -> list:
        """
        Search stocks on Investidor10
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            }
            
            url = f"{Investidor10Service.BASE_URL}/api/search"
            params = {"q": query}
            
            response = requests.get(url, params=params, headers=headers, timeout=10)
            
            if response.status_code == 200:
                results = response.json()
                return [
                    {
                        "ticker": r.get("symbol"),
                        "name": r.get("name"),
                        "type": r.get("type"),
                        "link": f"{Investidor10Service.BASE_URL}/acoes/{r.get('symbol')}/"
                    }
                    for r in results[:10]
                ]
            return []
            
        except Exception as e:
            print(f"Error searching Investidor10 for {query}: {e}")
            return []

    @staticmethod
    def get_fii_data(fii_ticker: str) -> Optional[Dict]:
        """
        Fetch FII (Fundo de Investimento Imobiliário) data
        """
        try:
            clean_ticker = fii_ticker.replace(".SA", "")
            
            url = f"{Investidor10Service.BASE_URL}/api/fiis/{clean_ticker}"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "source": "investidor10",
                    "ticker": clean_ticker,
                    "type": "FII",
                    "price": data.get("price"),
                    "dividend_yield": data.get("dividendYield"),
                    "pvp_ratio": data.get("pvpRatio"),
                    "distribution": data.get("distribution"),
                    "link": f"{Investidor10Service.BASE_URL}/fiis/{clean_ticker}/"
                }
            
            return {
                "source": "investidor10",
                "ticker": clean_ticker,
                "type": "FII",
                "link": f"{Investidor10Service.BASE_URL}/fiis/{clean_ticker}/"
            }
            
        except Exception as e:
            print(f"Error fetching FII data from Investidor10 for {fii_ticker}: {e}")
            return None
