"""
Schemas Pydantic para validação de request/response
"""
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from decimal import Decimal


# ==================== ASSET ====================

class AssetBase(BaseModel):
    """Base para Asset"""
    ticker: str
    name: str
    asset_type: str  # acao, etf, fii, bdr, indice
    sector: Optional[str] = None
    currency: str = "BRL"
    active: bool = True


class AssetCreate(AssetBase):
    """Criação de Asset"""
    pass


class AssetResponse(AssetBase):
    """Resposta de Asset"""
    id: UUID
    updated_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== QUOTE ====================

class QuoteBase(BaseModel):
    """Base para Cotação"""
    date: datetime
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: Optional[int] = None
    volume_moeda: Optional[Decimal] = None


class QuoteCreate(QuoteBase):
    """Criação de Cotação"""
    asset_id: UUID


class QuoteResponse(QuoteBase):
    """Resposta de Cotação"""
    id: UUID
    asset_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== TECHNICAL INDICATOR ====================

class TechnicalIndicatorBase(BaseModel):
    """Base para Indicadores Técnicos"""
    date: datetime
    rsi14: Optional[Decimal] = None
    macd: Optional[Decimal] = None
    macd_signal: Optional[Decimal] = None
    macd_histogram: Optional[Decimal] = None
    bollinger_upper: Optional[Decimal] = None
    bollinger_middle: Optional[Decimal] = None
    bollinger_lower: Optional[Decimal] = None
    volatility_30d: Optional[Decimal] = None


class TechnicalIndicatorCreate(TechnicalIndicatorBase):
    """Criação de Indicador Técnico"""
    asset_id: UUID


class TechnicalIndicatorResponse(TechnicalIndicatorBase):
    """Resposta de Indicador Técnico"""
    id: UUID
    asset_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== TARGET PROFIT SIMULATION ====================

class TargetProfitScenario(BaseModel):
    """Cenário de simulação"""
    name: str
    target_price: Decimal
    probability: Decimal


class TargetProfitSimulationBase(BaseModel):
    """Base para Simulação de Lucro-Alvo"""
    asset_id: UUID
    entry_price: Decimal
    target_gain: Decimal  # em %


class TargetProfitSimulationCreate(TargetProfitSimulationBase):
    """Criação de Simulação de Lucro-Alvo"""
    pass


class TargetProfitSimulationResponse(BaseModel):
    """Resposta de Simulação de Lucro-Alvo"""
    id: UUID
    user_id: UUID
    asset_id: UUID
    created_at: datetime
    entry_price: Decimal
    target_gain: Decimal
    target_price: Decimal
    suggested_stop_loss: Optional[Decimal] = None
    risk_benefit_ratio: Optional[Decimal] = None
    probability_target: Optional[Decimal] = None
    estimated_days: Optional[int] = None
    max_historical_drawdown: Optional[Decimal] = None
    scenarios_json: Optional[str] = None
    
    class Config:
        from_attributes = True


# ==================== VALUATION ====================

class ValuationScenario(BaseModel):
    """Cenário de valuation"""
    name: str  # pessimista, base, otimista
    discount_rate: Decimal
    fair_value: Decimal


class ValuationBase(BaseModel):
    """Base para Valuation"""
    roe: Optional[Decimal] = None
    roic: Optional[Decimal] = None
    ebitda_margin: Optional[Decimal] = None
    debt_ebitda: Optional[Decimal] = None
    revenue_growth: Optional[Decimal] = None
    dcf_fair_value: Optional[Decimal] = None
    current_price: Optional[Decimal] = None
    pe: Optional[Decimal] = None
    pe_projected: Optional[Decimal] = None
    pb: Optional[Decimal] = None
    pvpa: Optional[Decimal] = None


class ValuationCreate(ValuationBase):
    """Criação de Valuation"""
    asset_id: UUID


class ValuationResponse(ValuationBase):
    """Resposta de Valuation"""
    id: UUID
    asset_id: UUID
    created_at: datetime
    updated_at: datetime
    discount_percentage: Optional[Decimal] = None
    scenarios_json: Optional[str] = None
    
    class Config:
        from_attributes = True


# ==================== USER ====================

class UserBase(BaseModel):
    """Base para Usuário"""
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """Criação de Usuário"""
    password: str


class UserResponse(UserBase):
    """Resposta de Usuário"""
    id: UUID
    active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== PORTFOLIO ====================

class PortfolioPosition(BaseModel):
    """Posição em um portfólio"""
    asset_id: UUID
    quantity: Decimal
    average_price: Decimal


class PortfolioBase(BaseModel):
    """Base para Portfólio"""
    name: str
    profile: str  # conservador, moderado, agressivo


class PortfolioCreate(PortfolioBase):
    """Criação de Portfólio"""
    positions: Optional[List[PortfolioPosition]] = None


class PortfolioResponse(PortfolioBase):
    """Resposta de Portfólio"""
    id: UUID
    user_id: UUID
    expected_return: Optional[Decimal] = None
    volatility: Optional[Decimal] = None
    active: bool
    created_at: datetime
    positions_json: Optional[str] = None
    
    class Config:
        from_attributes = True


# ==================== FIXED INCOME ====================

class FixedIncomeBase(BaseModel):
    """Base para Renda Fixa"""
    codigo_tesoureiro: str
    name: str
    tipo: str  # prefixado, ipca, selic
    maturity_date: datetime


class FixedIncomeCreate(FixedIncomeBase):
    """Criação de Renda Fixa"""
    taxa_compra: Optional[Decimal] = None
    taxa_venda: Optional[Decimal] = None
    pu_bd: Optional[Decimal] = None
    pu_pf: Optional[Decimal] = None
    vna_atual: Optional[Decimal] = None


class FixedIncomeResponse(FixedIncomeBase):
    """Resposta de Renda Fixa"""
    id: UUID
    taxa_compra: Optional[Decimal] = None
    taxa_venda: Optional[Decimal] = None
    pu_bd: Optional[Decimal] = None
    pu_pf: Optional[Decimal] = None
    vna_atual: Optional[Decimal] = None
    updated_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== GENERIC ====================

class PaginationParams(BaseModel):
    """Parâmetros de paginação"""
    skip: int = Field(0, ge=0)
    limit: int = Field(10, ge=1, le=100)


class ErrorResponse(BaseModel):
    """Resposta de erro"""
    detail: str
    status_code: int
