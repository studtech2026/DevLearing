"""
Refresh token repository.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException
from app.models.refresh_token import RefreshToken
from app.repositories.base_repository import BaseRepository


class RefreshTokenRepository(BaseRepository[RefreshToken]):
    """
    Repository for RefreshToken operations.
    """

    def __init__(self, db: Session):
        super().__init__(db, RefreshToken)

    # =====================================================
    # Lookup
    # =====================================================

    def get_by_token_hash(
        self,
        token_hash: str,
    ) -> RefreshToken | None:
        """
        Find a refresh token by its hash.
        """
        return (
            self.db.query(RefreshToken)
            .filter(
                RefreshToken.token_hash == token_hash,
            )
            .first()
        )

    def get_active_token(
        self,
        token_hash: str,
    ) -> RefreshToken | None:
        """
        Return a non-revoked, non-expired refresh token.
        """
        now = datetime.now(timezone.utc)

        return (
            self.db.query(RefreshToken)
            .filter(
                RefreshToken.token_hash == token_hash,
                RefreshToken.revoked.is_(False),
                RefreshToken.expires_at > now,
            )
            .first()
        )

    # =====================================================
    # Revoke
    # =====================================================

    def revoke(
        self,
        token: RefreshToken,
    ) -> RefreshToken:
        """
        Revoke a refresh token.
        """
        try:
            token.revoked = True
            return self.update(token)

        except SQLAlchemyError as exc:
            self.db.rollback()
            raise DatabaseException(
                "Failed to revoke refresh token."
            ) from exc

    def revoke_by_hash(
        self,
        token_hash: str,
    ) -> bool:
        """
        Revoke a refresh token using its hash.
        """
        token = self.get_by_token_hash(token_hash)

        if token is None:
            return False

        self.revoke(token)
        return True

    def revoke_all_for_user(
        self,
        user_id: int,
    ) -> int:
        """
        Revoke every active refresh token of a user.
        """
        try:
            rows = (
                self.db.query(RefreshToken)
                .filter(
                    RefreshToken.user_id == user_id,
                    RefreshToken.revoked.is_(False),
                )
                .all()
            )

            for row in rows:
                row.revoked = True

            self.db.commit()

            return len(rows)

        except SQLAlchemyError as exc:
            self.db.rollback()
            raise DatabaseException(
                "Failed to revoke refresh tokens."
            ) from exc

    # =====================================================
    # Cleanup
    # =====================================================

    def delete_expired(self) -> int:
        """
        Delete expired refresh tokens.
        """
        try:
            now = datetime.now(timezone.utc)

            deleted = (
                self.db.query(RefreshToken)
                .filter(
                    RefreshToken.expires_at < now,
                )
                .delete(synchronize_session=False)
            )

            self.db.commit()

            return deleted

        except SQLAlchemyError as exc:
            self.db.rollback()
            raise DatabaseException(
                "Failed to delete expired refresh tokens."
            ) from exc