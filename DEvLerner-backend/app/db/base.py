"""
SQLAlchemy declarative base.

All ORM models must import `Base` from this module.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy ORM models in the application.
    """

    pass
