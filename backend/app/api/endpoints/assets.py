"""
Endpoints para Assets
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db import get_db
from app.models.orm import AssetModel, QuoteModel
from app.schemas import AssetResponse, AssetCreate, QuoteResponse, PaginationParams

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=List[AssetResponse])
def list_assets(
    ticker: str = Query(None),
    asset_type: str = Query(None),
    sector: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Listar ativos com filtros opcionais
    
    - **ticker**: filtrar por ticker (parcial, case-insensitive)
    - **asset_type**: tipo (acao, etf, fii, bdr, indice)
    - **sector**: setor
    """
    query = db.query(AssetModel).filter(AssetModel.active == True)
    
    if ticker:
        query = query.filter(AssetModel.ticker.ilike(f"%{ticker}%"))
    if asset_type:
        query = query.filter(AssetModel.asset_type == asset_type)
    if sector:
        query = query.filter(AssetModel.sector == sector)
    
    assets = query.offset(skip).limit(limit).all()
    return assets


@router.get("/{ticker}", response_model=AssetResponse)
def get_asset_by_ticker(
    ticker: str,
    db: Session = Depends(get_db),
):
    """
    Obter detalhes de um ativo pelo ticker
    """
    asset = db.query(AssetModel).filter(AssetModel.ticker == ticker.upper()).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.get("/{asset_id}/quotes", response_model=List[QuoteResponse])
def get_asset_quotes(
    asset_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(30, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """
    Obter histórico de cotações de um ativo
    
    - **limit**: quantidade de registros (máx 500)
    """
    asset = db.query(AssetModel).filter(AssetModel.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    quotes = (
        db.query(QuoteModel)
        .filter(QuoteModel.asset_id == asset_id)
        .order_by(QuoteModel.date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return quotes


@router.post("", response_model=AssetResponse)
def create_asset(
    asset_create: AssetCreate,
    db: Session = Depends(get_db),
):
    """
    Criar novo ativo (admin only)
    """
    # Verificar se ticker já existe
    existing = db.query(AssetModel).filter(AssetModel.ticker == asset_create.ticker.upper()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Asset ticker already exists")
    
    db_asset = AssetModel(
        ticker=asset_create.ticker.upper(),
        name=asset_create.name,
        asset_type=asset_create.asset_type,
        sector=asset_create.sector,
        currency=asset_create.currency,
        active=asset_create.active,
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset
