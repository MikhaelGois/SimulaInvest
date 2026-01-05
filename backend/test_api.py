"""
Testes básicos dos endpoints
Rodar: pytest test_api.py -v
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import SessionLocal, get_db

client = TestClient(app)


def test_health():
    """Teste de health check"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root():
    """Teste de raiz"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_list_assets():
    """Teste de listagem de ativos"""
    response = client.get("/api/v1/assets")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_list_fixed_income():
    """Teste de listagem de renda fixa"""
    response = client.get("/api/v1/fixed-income")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_api_docs():
    """Teste se docs estão disponíveis"""
    response = client.get("/docs")
    assert response.status_code == 200
