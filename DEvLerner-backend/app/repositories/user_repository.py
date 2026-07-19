"""
User repository.

Contains all database operations related to users.
"""

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """
    Repository for User operations.
    """

    def __init__(self, db: Session):
        super().__init__(db, User)

    # =====================================================
    # Lookup
    # =====================================================

    def get_by_email(
        self,
        email: str,
    ) -> User | None:
        """
        Find a user by email.
        """
        return (
            self.db.query(User)
            .filter(User.email == email.strip().lower())
            .first()
        )

    def get_by_username(
        self,
        username: str,
    ) -> User | None:
        """
        Find a user by username.
        """
        return (
            self.db.query(User)
            .filter(User.username.ilike(username.strip()))
            .first()
        )

    def get_by_email_or_username(
        self,
        value: str,
    ) -> User | None:
        """
        Login using email or username.
        """
        value = value.strip()

        return (
            self.db.query(User)
            .filter(
                or_(
                    User.email == value.lower(),
                    User.username.ilike(value),
                )
            )
            .first()
        )

    def email_exists(
        self,
        email: str,
    ) -> bool:
        """
        Check if an email already exists.
        """
        return self.get_by_email(email) is not None

    def username_exists(
        self,
        username: str,
    ) -> bool:
        """
        Check if username already exists.
        """
        return self.get_by_username(username) is not None

    # =====================================================
    # Status
    # =====================================================

    def activate(
        self,
        user: User,
    ) -> User:
        """
        Activate a user.
        """
        user.is_active = True
        return self.update(user)

    def deactivate(
        self,
        user: User,
    ) -> User:
        """
        Deactivate a user.
        """
        user.is_active = False
        return self.update(user)

    def get_active_users(self) -> list[User]:
        """
        Return all active users.
        """
        return (
            self.db.query(User)
            .filter(User.is_active.is_(True))
            .all()
        )

    # =====================================================
    # Search
    # =====================================================

    def search(
        self,
        keyword: str,
        skip: int = 0,
        limit: int = 20,
    ) -> list[User]:
        """
        Search users by name.
        """
        return (
            self.db.query(User)
            .filter(User.name.ilike(f"%{keyword.strip()}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

    # =====================================================
    # Statistics
    # =====================================================

    def total_users(self) -> int:
        """
        Total registered users.
        """
        return self.count()

    def active_users_count(self) -> int:
        """
        Count active users.
        """
        return (
            self.db.query(User)
            .filter(User.is_active.is_(True))
            .count()
        )