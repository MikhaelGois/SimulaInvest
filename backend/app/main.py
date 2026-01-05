from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.db import init_db

# Inicializar banco de dados
init_db()

app = FastAPI(title="SimulaInvest API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "message": "SimulaInvest API",
        "version": "1.0.0",
        "docs": "/docs",
    }

@app.get("/health")
def health():
    return {"status": "ok", "service": "simulainvest-api"}

