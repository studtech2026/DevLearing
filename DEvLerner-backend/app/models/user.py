"""
User ORM model.

Represents a user of the DevLearner platform.
"""

from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def _utcnow() -> datetime:
    """Return current UTC time (timezone-aware)."""
    return datetime.now(timezone.utc)


class User(Base):
    """
    ORM model for application users.
    """

    __tablename__ = "users"

    # =====================================================
    # Primary Information
    # =====================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
        index=True,
    )

    # =====================================================
    # Authentication
    # =====================================================

    password_hash: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # =====================================================
    # Optional Profile
    # =====================================================

    username: Mapped[str | None] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
        index=True,
    )

    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    date_of_birth: Mapped[str | None] = mapped_column(Date, nullable=True)

    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)

    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    profile_picture: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # =====================================================
    # Status / Audit
    # =====================================================

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )

    # =====================================================
    # Helpers
    # =====================================================

    def to_dict(self) -> dict:
        """Serialize the user to a plain dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "username": self.username,
            "phone": self.phone,
            "gender": self.gender,
            "date_of_birth": (
                self.date_of_birth.isoformat() if self.date_of_birth else None
            ),
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "country": self.country,
            "bio": self.bio,
            "profile_picture": self.profile_picture,
            "is_active": self.is_active,
            "created_at": (
                self.created_at.isoformat() if self.created_at else None
            ),
            "updated_at": (
                self.updated_at.isoformat() if self.updated_at else None
            ),
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<User id={self.id} email={self.email!r}>"
