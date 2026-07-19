"""
Revoked token repository.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException
from app.models.revoked_token import RevokedToken
from app.repositories.base_repository import BaseRepository


class RevokedTokenRepository(BaseRepository[RevokedToken]):
    """
    Repository for RevokedToken operations.
    """

    def __init__(self, db: Session):
        super().__init__(db, RevokedToken)

    # =====================================================
    # Lookup
    # =====================================================

    def get_by_jti(
        self,
        jti: str,
    ) -> RevokedToken | None:
        """
        Find a revoked token by its JWT ID.
        """
        return (
            self.db.query(RevokedToken)
            .filter(
                RevokedToken.jti == jti,
            )
            .first()
        )

    def is_revoked(
        self,
        jti: str,
    ) -> bool:
        """
        Check whether a JWT has been revoked.
        """
        return self.get_by_jti(jti) is not None

    # =====================================================
    # Create
    # =====================================================

    def revoke_token(
        self,
        jti: str,
        expires_at: datetime,
    ) -> RevokedToken:
        """
        Store a revoked JWT.
        """
        token = RevokedToken(
            jti=jti,
            expires_at=expires_at,
        )

        return self.create(token)

    # =====================================================
    # Cleanup
    # =====================================================

    def delete_expired(self) -> int:
        """
        Delete expired revoked tokens.
        """
        try:
            now = datetime.now(timezone.utc)

            deleted = (
                self.db.query(RevokedToken)
                .filter(
                    RevokedToken.expires_at < now,
                )
                .delete(
                    synchronize_session=False,
                )
            )

            self.db.commit()

            return deleted

        except SQLAlchemyError as exc:
            self.db.rollback()

            raise DatabaseException(
                "Failed to delete expired revoked tokens."
            ) from exc