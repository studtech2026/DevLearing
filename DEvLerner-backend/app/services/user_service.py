"""
User service.

Contains user business logic.
"""
from fastapi import HTTPException, status

from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository


class UserService:
    """
    User business logic.
    """

    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def get_user(
        self,
        user_id: int,
    ) -> User | None:
        """
        Get user by ID.
        """

        return self.user_repository.get_by_id(user_id)

    def get_all_users(self) -> list[User]:
        """
        Return all users.
        """

        return self.user_repository.get_all()

    def search_users(
        self,
        keyword: str,
    ) -> list[User]:
        """
        Search users.
        """

        return self.user_repository.search(keyword)

    def deactivate_user(
        self,
        user_id: int,
    ) -> User:
        """
        Deactivate user account.
        """

        user = self.user_repository.get_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return self.user_repository.deactivate(user)

    def activate_user(
        self,
        user_id: int,
    ) -> User:
        """
        Activate user account.
        """

        user = self.user_repository.get_by_id(user_id)

        if not user:
            raise ValueError("User not found")

        return self.user_repository.activate(user)