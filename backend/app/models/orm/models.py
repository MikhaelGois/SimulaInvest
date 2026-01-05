"""
Modelos ORM para o banco de dados
"""
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, Enum, ForeignKey, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum

from app.db import Base


class AssetType(str, enum.Enum):
    """Tipo de ativo"""
    ACAO = "acao"
    ETF = "etf"
    FII = "fii"
    BDR = "bdr"
    INDICE = "indice"


class AssetModel(Base):
    """Ativo (ação, ETF, FII, BDR, índice)"""
    __tablename__ = "assets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticker = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    asset_type = Column(Enum(AssetType), nullable=False)
    sector = Column(String(100), nullable=True)
    currency = Column(String(3), default="BRL")
    active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    quotes = relationship("QuoteModel", back_populates="asset", cascade="all, delete-orphan")
    technical_indicators = relationship("TechnicalIndicatorModel", back_populates="asset", cascade="all, delete-orphan")
    valuations = relationship("ValuationModel", back_populates="asset", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Asset {self.ticker}>"


class QuoteModel(Base):
    """Cotação diária de um ativo"""
    __tablename__ = "quotes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    open = Column(Numeric(15, 4), nullable=False)
    high = Column(Numeric(15, 4), nullable=False)
    low = Column(Numeric(15, 4), nullable=False)
    close = Column(Numeric(15, 4), nullable=False)
    volume = Column(Integer, nullable=True)
    volume_moeda = Column(Numeric(20, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Unique constraint: um ativo por data
    __table_args__ = (
        {"indexes": [{"columns": ["asset_id", "date"], "unique": True}]},
    )
    
    # Relationships
    asset = relationship("AssetModel", back_populates="quotes")
    
    def __repr__(self):
        return f"<Quote {self.asset_id} on {self.date}>"


class TechnicalIndicatorModel(Base):
    """Indicadores técnicos calculados para uma cotação"""
    __tablename__ = "technical_indicators"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    rsi14 = Column(Numeric(5, 2), nullable=True)  # 0-100
    macd = Column(Numeric(15, 4), nullable=True)
    macd_signal = Column(Numeric(15, 4), nullable=True)
    macd_histogram = Column(Numeric(15, 4), nullable=True)
    bollinger_upper = Column(Numeric(15, 4), nullable=True)
    bollinger_middle = Column(Numeric(15, 4), nullable=True)
    bollinger_lower = Column(Numeric(15, 4), nullable=True)
    volatility_30d = Column(Numeric(5, 2), nullable=True)  # em %
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    asset = relationship("AssetModel", back_populates="technical_indicators")
    
    def __repr__(self):
        return f"<TechnicalIndicator {self.asset_id} on {self.date}>"


class TargetProfitSimulationModel(Base):
    """Simulação de Lucro-Alvo"""
    __tablename__ = "target_profit_simulations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    entry_price = Column(Numeric(15, 4), nullable=False)
    target_gain = Column(Numeric(5, 2), nullable=False)  # em %
    target_price = Column(Numeric(15, 4), nullable=False)  # calculado
    suggested_stop_loss = Column(Numeric(15, 4), nullable=True)
    risk_benefit_ratio = Column(Numeric(5, 2), nullable=True)
    probability_target = Column(Numeric(5, 2), nullable=True)  # 0-100
    estimated_days = Column(Integer, nullable=True)
    max_historical_drawdown = Column(Numeric(5, 2), nullable=True)
    
    # Cenários (armazenado como JSON text, poderia ser normalizados em outra tabela)
    scenarios_json = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<TargetProfitSimulation {self.user_id} for {self.asset_id}>"


class ValuationModel(Base):
    """Valuation de uma empresa (DCF + múltiplos)"""
    __tablename__ = "valuations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Fundamentos
    roe = Column(Numeric(5, 2), nullable=True)  # %
    roic = Column(Numeric(5, 2), nullable=True)  # %
    ebitda_margin = Column(Numeric(5, 2), nullable=True)  # %
    debt_ebitda = Column(Numeric(5, 2), nullable=True)
    revenue_growth = Column(Numeric(5, 2), nullable=True)  # % projetado
    
    # DCF
    dcf_fair_value = Column(Numeric(15, 4), nullable=True)
    current_price = Column(Numeric(15, 4), nullable=True)
    discount_percentage = Column(Numeric(5, 2), nullable=True)  # DCF vs preço
    
    # Múltiplos
    pe = Column(Numeric(10, 2), nullable=True)
    pe_projected = Column(Numeric(10, 2), nullable=True)
    pb = Column(Numeric(10, 2), nullable=True)
    pvpa = Column(Numeric(10, 2), nullable=True)
    
    # Cenários (JSON)
    scenarios_json = Column(Text, nullable=True)
    
    # Relationships
    asset = relationship("AssetModel", back_populates="valuations")
    
    def __repr__(self):
        return f"<Valuation {self.asset_id}>"


class UserModel(Base):
    """Usuário da plataforma"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    simulations = relationship("TargetProfitSimulationModel", cascade="all, delete-orphan")
    portfolios = relationship("PortfolioModel", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.email}>"


class PortfolioModel(Base):
    """Portfólio de um usuário"""
    __tablename__ = "portfolios"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    profile = Column(String(50), nullable=False)  # conservador, moderado, agressivo
    expected_return = Column(Numeric(5, 2), nullable=True)  # %
    volatility = Column(Numeric(5, 2), nullable=True)  # %
    active = Column(Boolean, default=True)
    rebalance_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Positions (JSON ou normalizado em outra tabela)
    positions_json = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<Portfolio {self.name}>"


class FixedIncomeModel(Base):
    """Títulos de Renda Fixa (Tesouro Direto, etc)"""
    __tablename__ = "fixed_income"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    codigo_tesoureiro = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    tipo = Column(String(50), nullable=False)  # prefixado, ipca, selic
    maturity_date = Column(DateTime, nullable=False)
    taxa_compra = Column(Numeric(5, 4), nullable=True)  # %
    taxa_venda = Column(Numeric(5, 4), nullable=True)  # %
    pu_bd = Column(Numeric(15, 4), nullable=True)
    pu_pf = Column(Numeric(15, 4), nullable=True)
    vna_atual = Column(Numeric(15, 4), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<FixedIncome {self.codigo_tesoureiro}>"
