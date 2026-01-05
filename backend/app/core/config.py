"""
Configurações da aplicação (settings via pydantic-settings)
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configurações globais da aplicação"""
    
    # Database
    DATABASE_URL: str = "postgresql://simulainvest:simulainvest@localhost:5432/simulainvest"
    ECHO_SQL: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SimulaInvest API"
    DEBUG: bool = True
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    BRAPI_KEY: Optional[str] = None
    BRAPI_BASE_URL: str = "https://brapi.dev/api"
    
    ANBIMA_BASE_URL: str = "https://api.anbima.com.br"
    ANBIMA_KEY: Optional[str] = None
    
    # CORS
    CORS_ORIGINS: list = ["*"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
