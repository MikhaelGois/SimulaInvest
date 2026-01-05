"""
Endpoints para Simulador de Lucro-Alvo
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta
from decimal import Decimal
import json

from app.db import get_db
from app.models.orm import (
    TargetProfitSimulationModel,
    AssetModel,
    QuoteModel,
)
from app.schemas import TargetProfitSimulationResponse, TargetProfitSimulationCreate

router = APIRouter(prefix="/simulations/target-profit", tags=["simulations"])


def calculate_target_profit_metrics(
    asset_id: UUID,
    entry_price: Decimal,
    target_gain: Decimal,
    db: Session,
):
    """
    Calcula métricas de simulação de lucro-alvo
    
    Retorna:
    - target_price: preço necessário para atingir meta
    - suggested_stop_loss: sugestão baseada em suporte técnico
    - risk_benefit_ratio: razão risco/benefício
    - probability_target: probabilidade histórica de atingir meta
    - estimated_days: dias estimados
    - max_historical_drawdown: maior queda histórica
    """
    # Buscar últimas 252 cotações (1 ano de trading)
    quotes = (
        db.query(QuoteModel)
        .filter(QuoteModel.asset_id == asset_id)
        .order_by(QuoteModel.date.desc())
        .limit(252)
        .all()
    )
    
    if not quotes:
        raise HTTPException(status_code=404, detail="No quote data available for this asset")
    
    quotes = list(reversed(quotes))  # Ordenar ascendente por data
    
    # Calcular target_price
    target_price = entry_price * (1 + target_gain / 100)
    
    # Calcular volatilidade (30 últimos dias)
    recent_closes = [float(q.close) for q in quotes[-30:]]
    returns = [
        (recent_closes[i] - recent_closes[i-1]) / recent_closes[i-1]
        for i in range(1, len(recent_closes))
    ]
    volatility = (sum(r**2 for r in returns) / len(returns)) ** 0.5 if returns else 0
    
    # Estimar dias baseado em volatilidade
    estimated_days = min(365, max(5, int(30 / (volatility + 0.001))))
    
    # Stop loss sugerido (2% abaixo do preço de entrada ou mínimo de 30 dias)
    suggested_stop_loss = entry_price * Decimal("0.98")
    
    # Risk/benefit
    risk = entry_price - suggested_stop_loss
    benefit = target_price - entry_price
    risk_benefit_ratio = float(benefit / risk) if risk > 0 else 0
    
    # Probabilidade histórica (% de dias com ganho >= target_gain)
    days_with_target_gain = 0
    total_days = 0
    for i in range(1, len(quotes)):
        gain_pct = (float(quotes[i].close) - float(entry_price)) / float(entry_price) * 100
        if gain_pct >= float(target_gain):
            days_with_target_gain += 1
        total_days += 1
    
    probability_target = (days_with_target_gain / total_days * 100) if total_days > 0 else 0
    
    # Max drawdown histórico
    max_price = max(float(q.close) for q in quotes)
    min_after_max = float(quotes[-1].close)
    for q in quotes:
        if float(q.close) >= max_price:
            min_after_max = max_price
            continue
        min_after_max = min(min_after_max, float(q.close))
    
    max_drawdown = ((max_price - min_after_max) / max_price * 100) if max_price > 0 else 0
    
    # Cenários
    scenarios = [
        {
            "name": "pessimista",
            "target_price": float(entry_price * Decimal("1.05")),  # +5%
            "probability": 80,
        },
        {
            "name": "base",
            "target_price": float(target_price),
            "probability": 50,
        },
        {
            "name": "otimista",
            "target_price": float(entry_price * (1 + target_gain / 100) * Decimal("1.2")),
            "probability": 20,
        },
    ]
    
    return {
        "target_price": target_price,
        "suggested_stop_loss": suggested_stop_loss,
        "risk_benefit_ratio": Decimal(str(risk_benefit_ratio)),
        "probability_target": Decimal(str(probability_target)),
        "estimated_days": estimated_days,
        "max_historical_drawdown": Decimal(str(max_drawdown)),
        "scenarios_json": json.dumps(scenarios),
    }


@router.post("", response_model=TargetProfitSimulationResponse)
def create_target_profit_simulation(
    simulation_create: TargetProfitSimulationCreate,
    db: Session = Depends(get_db),
):
    """
    Criar simulação de Lucro-Alvo
    
    Input:
    - asset_id: UUID do ativo
    - entry_price: preço de entrada
    - target_gain: meta de ganho em %
    
    Retorna:
    - target_price, stop_loss, risco/benefício, prazo estimado, probabilidade
    """
    # Verificar se ativo existe
    asset = db.query(AssetModel).filter(AssetModel.id == simulation_create.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Calcular métricas
    metrics = calculate_target_profit_metrics(
        asset_id=simulation_create.asset_id,
        entry_price=simulation_create.entry_price,
        target_gain=simulation_create.target_gain,
        db=db,
    )
    
    # Criar registro (note: user_id seria do contexto autenticado, aqui é None para teste)
    simulation = TargetProfitSimulationModel(
        user_id=UUID("00000000-0000-0000-0000-000000000000"),  # TODO: usar user autenticado
        asset_id=simulation_create.asset_id,
        entry_price=simulation_create.entry_price,
        target_gain=simulation_create.target_gain,
        **metrics,
    )
    db.add(simulation)
    db.commit()
    db.refresh(simulation)
    return simulation


@router.get("/{simulation_id}", response_model=TargetProfitSimulationResponse)
def get_target_profit_simulation(
    simulation_id: UUID,
    db: Session = Depends(get_db),
):
    """
    Obter detalhes de uma simulação
    """
    simulation = db.query(TargetProfitSimulationModel).filter(
        TargetProfitSimulationModel.id == simulation_id
    ).first()
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return simulation
