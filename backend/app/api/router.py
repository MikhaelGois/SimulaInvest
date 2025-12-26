from fastapi import APIRouter
from app.api.endpoints.symbols import router as symbols_router
from app.api.endpoints.auth import router as auth_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(symbols_router, prefix="/symbols", tags=["symbols"])
