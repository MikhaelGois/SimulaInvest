from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.database import Base

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
