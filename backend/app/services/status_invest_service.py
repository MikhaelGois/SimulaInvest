import requests
from typing import Optional, Dict

class StatusInvestService:
    BASE_URL = "https://www.statusinvest.com.br"
    API_URL = "https://api.statusinvest.com.br"
    
    @staticmethod
    def get_stock_data(ticker: str) -> Optional[Dict]:
        """
        Fetch stock data from Status Invest
        """
        try:
            # Remove .SA if present for Status Invest API
            clean_ticker = ticker.replace(".SA", "")
            
            # Try Status Invest API
            url = f"{StatusInvestService.API_URL}/quote/{clean_ticker}"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "source": "status_invest",
                    "ticker": clean_ticker,
                    "price": data.get("price") or data.get("lastPrice"),
                    "pe_ratio": data.get("pe"),
                    "pb_ratio": data.get("pb"),
                    "dividend_yield": data.get("dy"),
                    "roa": data.get("roa"),
                    "roe": data.get("roe"),
                    "net_margin": data.get("netMargin"),
                    "roic": data.get("roic"),
                    "ev_ebitda": data.get("evEbitda"),
                    "sector": data.get("sector"),
                    "subsector": data.get("subsector"),
                }
            
            # Fallback: return data with link
            return {
                "source": "status_invest",
                "ticker": clean_ticker,
                "link": f"{StatusInvestService.BASE_URL}/acoes/{clean_ticker}",
                "note": "Detailed data available on Status Invest"
            }
            
        except Exception as e:
            print(f"Error fetching Status Invest data for {ticker}: {e}")
            return None

    @staticmethod
    def search_stocks(query: str) -> list:
        """
        Search stocks on Status Invest
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            }
            
            url = f"{StatusInvestService.API_URL}/search"
            params = {"q": query, "type": "stock"}
            
            response = requests.get(url, params=params, headers=headers, timeout=10)
            
            if response.status_code == 200:
                results = response.json()
                return [
                    {
                        "ticker": r.get("ticker"),
                        "name": r.get("name"),
                        "type": r.get("type"),
                        "link": f"{StatusInvestService.BASE_URL}/acoes/{r.get('ticker')}/"
                    }
                    for r in results[:10]
                ]
            return []
            
        except Exception as e:
            print(f"Error searching Status Invest for {query}: {e}")
            return []

    @staticmethod
    def get_fii_data(fii_ticker: str) -> Optional[Dict]:
        """
        Fetch FII (Fundo de Investimento Imobiliário) data from Status Invest
        """
        try:
            clean_ticker = fii_ticker.replace(".SA", "")
            
            url = f"{StatusInvestService.API_URL}/fii/{clean_ticker}"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "source": "status_invest",
                    "ticker": clean_ticker,
                    "type": "FII",
                    "price": data.get("price") or data.get("lastPrice"),
                    "dividend_yield": data.get("dy"),
                    "pvp_ratio": data.get("pvp"),
                    "distribution": data.get("distribution"),
                    "sector": data.get("sector"),
                    "link": f"{StatusInvestService.BASE_URL}/fiis/{clean_ticker}/"
                }
            
            return {
                "source": "status_invest",
                "ticker": clean_ticker,
                "type": "FII",
                "link": f"{StatusInvestService.BASE_URL}/fiis/{clean_ticker}/"
            }
            
        except Exception as e:
            print(f"Error fetching FII data from Status Invest for {fii_ticker}: {e}")
            return None

    @staticmethod
    def get_analyst_recommendations(ticker: str) -> list:
        """
        Fetch analyst recommendations from Status Invest
        """
        try:
            clean_ticker = ticker.replace(".SA", "")
            
            url = f"{StatusInvestService.API_URL}/quote/{clean_ticker}/recommendations"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            return []
            
        except Exception as e:
            print(f"Error fetching analyst recommendations from Status Invest for {ticker}: {e}")
            return []
