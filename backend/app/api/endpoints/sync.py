"""
Endpoints para sincronização de dados (admin only)
Integra brapi, ANBIMA e CVM
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import asyncio

from app.db import get_db
from app.services.brapi_service import brapi_sync_quotes
from app.services.anbima_service import anbima_sync_titles

router = APIRouter(prefix="/admin/sync", tags=["admin"])


@router.post("/brapi/quotes")
async def sync_brapi_quotes(
    tickers: List[str] = Query(...),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Sincronizar cotações de ativos via brapi.dev
    
    Query params:
    - tickers: Lista de tickers (ex: ?tickers=PETR4&tickers=VALE3)
    
    Retorna status de sucesso/falha por ticker
    """
    if not tickers:
        raise HTTPException(status_code=400, detail="Forneça pelo menos um ticker")
    
    result = await brapi_sync_quotes(tickers, db)
    return {
        "message": "Sincronização brapi concluída",
        "result": result,
    }


@router.post("/anbima/titles")
async def sync_anbima_titles(
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Sincronizar títulos públicos (Tesouro Direto) via ANBIMA
    
    Retorna status de sucesso/falha
    """
    from app.services.anbima_service import anbima_sync_titles
    
    result = await anbima_sync_titles(db)
    return {
        "message": "Sincronização ANBIMA concluída",
        "result": result,
    }


@router.post("/cvm/fundamentals")
async def sync_cvm_fundamentals(
    tickers: List[str] = Query(...),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Sincronizar dados fundamentalistas via CVM Dados Abertos
    
    Query params:
    - tickers: Lista de tickers (ex: ?tickers=PETR4&tickers=VALE3)
    
    Retorna status de sucesso/falha por ticker
    """
    if not tickers:
        raise HTTPException(status_code=400, detail="Forneça pelo menos um ticker")
    
    from app.services.cvm_service import cvm_sync_fundamentals
    
    result = await cvm_sync_fundamentals(tickers, db)
    return {
        "message": "Sincronização CVM concluída",
        "result": result,
    }


@router.post("/full-sync")
async def full_sync(
    tickers: List[str] = Query(...),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Sincronização completa: cotações (brapi) + títulos (ANBIMA) + fundamentals (CVM)
    
    Query params:
    - tickers: Lista de tickers para sincronizar
    """
    if not tickers:
        raise HTTPException(status_code=400, detail="Forneça pelo menos um ticker")
    
    results = {}
    
    # Sync brapi (cotações)
    results["brapi"] = await brapi_sync_quotes(tickers, db)
    
    # Sync ANBIMA (títulos públicos)
    from app.services.anbima_service import anbima_sync_titles
    results["anbima"] = await anbima_sync_titles(db)
    
    # Sync CVM (fundamentals)
    from app.services.cvm_service import cvm_sync_fundamentals
    results["cvm"] = await cvm_sync_fundamentals(tickers, db)
    
    return {
        "message": "Sincronização completa concluída",
        "results": results,
    }


@router.get("/status")
async def sync_status() -> Dict[str, str]:
    """
    Status das integrações (verificar disponibilidade das APIs)
    """
    from app.services.brapi_service import get_brapi_service
    from app.services.anbima_service import get_anbima_service
    from app.services.cvm_service import get_cvm_service
    
    status = {}
    
    # Verificar brapi
    try:
        brapi = get_brapi_service()
        quote = await brapi.get_quote("PETR4")
        status["brapi"] = "✓ Online" if quote else "⚠ Sem dados"
        await brapi.close()
    except Exception as e:
        status["brapi"] = f"✗ Offline: {str(e)[:50]}"
    
    # Verificar ANBIMA
    try:
        anbima = get_anbima_service()
        titles = await anbima.get_treasury_rates()
        status["anbima"] = "✓ Online" if titles else "⚠ Sem dados"
        await anbima.close()
    except Exception as e:
        status["anbima"] = f"✗ Offline: {str(e)[:50]}"
    
    # Verificar CVM
    try:
        cvm = get_cvm_service()
        companies = await cvm.list_companies(limit=1)
        status["cvm"] = "✓ Online" if companies else "⚠ Sem dados"
        await cvm.close()
    except Exception as e:
        status["cvm"] = f"✗ Offline: {str(e)[:50]}"
    
    return status
