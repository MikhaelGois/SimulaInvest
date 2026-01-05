"""
Configuração de banco de dados com SQLAlchemy
"""
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Base para todos os models ORM
Base = declarative_base()

# Engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ECHO_SQL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    # Use StaticPool para testes
    # poolclass=StaticPool  # Descomentar para testes
)

# SessionLocal
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def init_db():
    """Cria todas as tabelas"""
    Base.metadata.create_all(bind=engine)
    logger.info("Database initialized")


def get_db():
    """Dependency para obter sessão do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
