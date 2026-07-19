"""
Database session configuration.
"""

from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.db.base import Base

# Import all models so SQLAlchemy can discover them
from app.models import *  # noqa: F401,F403

DATABASE_URL = settings.database_url

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.debug,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


# =====================================================
# Database Initialization
# =====================================================

def init_db() -> None:
    """
    Create all database tables if they do not already exist.
    """
    Base.metadata.create_all(bind=engine)


# =====================================================
# Database Dependency
# =====================================================

def get_db() -> Generator[Session, None, None]:
    """
    FastAPI database dependency.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()