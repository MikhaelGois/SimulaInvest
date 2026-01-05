from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str
    risk_profile: Optional[str] = None
    objective: Optional[str] = None


class UserInDB(UserBase):
    user_id: str
    created_at: datetime
    is_active: bool
    risk_profile: Optional[str] = None
    objective: Optional[str] = None
    subscription_plan: str = "free"

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    subscription_plan: Optional[str] = None


class TokenData(BaseModel):
    email: Optional[str] = None


class SymbolBase(BaseModel):
    ticker: str
    name: Optional[str] = None
    type: Optional[str] = None


class SymbolRead(SymbolBase):
    id: int

    class Config:
        from_attributes = True


class SimulatorInput(BaseModel):
    ticker: str
    initial_investment: float
    profit_target: float
    method: str = "montecarlo"
    reinvest_dividends: bool = True


class SimulatorResult(BaseModel):
    ticker: str
    initial_investment: float
    profit_target: float
    method: str
    reinvest_dividends: bool
    p10_months: Optional[float] = None
    p50_months: Optional[float] = None
    p90_months: Optional[float] = None
    prob_not_hit_in_5y: Optional[float] = None
    assumptions: dict
    error: Optional[str] = None
    warning: Optional[str] = None
