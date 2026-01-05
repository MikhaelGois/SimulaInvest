"""
Endpoints para Renda Fixa (Tesouro Direto, etc)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db import get_db
from app.models.orm import FixedIncomeModel
from app.schemas import FixedIncomeResponse, FixedIncomeCreate

router = APIRouter(prefix="/fixed-income", tags=["fixed-income"])


@router.get("", response_model=List[FixedIncomeResponse])
def list_fixed_income(
    tipo: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Listar títulos de Renda Fixa
    
    - **tipo**: filtrar por tipo (prefixado, ipca, selic)
    """
    query = db.query(FixedIncomeModel)
    
    if tipo:
        query = query.filter(FixedIncomeModel.tipo == tipo)
    
    items = query.order_by(FixedIncomeModel.maturity_date).offset(skip).limit(limit).all()
    return items


@router.get("/{codigo_tesoureiro}", response_model=FixedIncomeResponse)
def get_fixed_income(
    codigo_tesoureiro: str,
    db: Session = Depends(get_db),
):
    """
    Obter detalhes de um título de Renda Fixa
    """
    item = db.query(FixedIncomeModel).filter(
        FixedIncomeModel.codigo_tesoureiro == codigo_tesoureiro
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Fixed income not found")
    return item


@router.post("", response_model=FixedIncomeResponse)
def create_fixed_income(
    fixed_income_create: FixedIncomeCreate,
    db: Session = Depends(get_db),
):
    """
    Criar novo título de Renda Fixa (admin only)
    """
    db_item = FixedIncomeModel(**fixed_income_create.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
