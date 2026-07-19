"""
Password reset repository.
"""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.password_reset import PasswordReset
from app.repositories.base_repository import BaseRepository


class PasswordResetRepository(BaseRepository[PasswordReset]):
    """Repository for PasswordReset operations."""

    def __init__(self, db: Session):
        super().__init__(db, PasswordReset)

    def get_by_token_hash(self, token_hash: str) -> PasswordReset | None:
        return (
            self.db.query(PasswordReset)
            .filter(PasswordReset.token_hash == token_hash)
            .first()
        )

    def delete_expired(self) -> int:
        now = datetime.now(timezone.utc)
        rows = (
            self.db.query(PasswordReset)
            .filter(PasswordReset.expires_at < now)
            .all()
        )
        for row in rows:
            self.db.delete(row)
        self.db.commit()
        return len(rows)
