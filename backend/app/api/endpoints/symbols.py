from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.yahoo_service import YahooService

router = APIRouter()

@router.get("/quote/{ticker}")
def get_quote(ticker: str, db: Session = Depends(get_db)):
    quote = YahooService.get_quote(ticker)
    if quote:
        return quote
    return {"error": "Quote not found"}

@router.get("/search")
def search(q: str, db: Session = Depends(get_db)):
    results = YahooService.search_tickers(q)
    return {"results": results}
