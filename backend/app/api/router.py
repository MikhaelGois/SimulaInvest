from fastapi import APIRouter
from app.api.endpoints.symbols import router as symbols_router

api_router = APIRouter()

api_router.include_router(symbols_router, prefix="/symbols", tags=["symbols"])
