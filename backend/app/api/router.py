from fastapi import APIRouter
from app.api.endpoints.assets import router as assets_router
from app.api.endpoints.simulations import router as simulations_router
from app.api.endpoints.fixed_income import router as fixed_income_router
from app.api.endpoints.sync import router as sync_router
from app.api.endpoints.auth import router as auth_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(assets_router)
api_router.include_router(simulations_router)
api_router.include_router(fixed_income_router)
api_router.include_router(sync_router)

