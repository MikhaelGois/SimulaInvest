import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, func
from sqlalchemy.orm import relationship
from app.models.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    risk_profile = Column(String(20))
    objective = Column(String(20))
    is_active = Column(Boolean, default=True)
    subscription_plan = Column(String(20), default="free")

class Symbol(Base):
    __tablename__ = "symbols"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String(20), unique=True, index=True)
    name = Column(String(255))
    asset_type = Column(String(50))
    prices = relationship("Price", back_populates="symbol")

class Price(Base):
    __tablename__ = "prices"

    id = Column(Integer, primary_key=True, index=True)
    symbol_id = Column(Integer, ForeignKey("symbols.id"))
    date = Column(DateTime, default=datetime.utcnow)
    close = Column(Float)
    volume = Column(Integer)
    symbol = relationship("Symbol", back_populates="prices")
