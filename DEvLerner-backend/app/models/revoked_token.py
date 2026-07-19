"""
Revoked access token ORM model.

Maintains a blacklist of JWT identifiers (jti) that have been logged out.
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class RevokedToken(Base):
    """
    Stores revoked access tokens until they expire.
    """

    __tablename__ = "revoked_tokens"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )

    jti: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
        index=True,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_utcnow,
        nullable=False,
    )
