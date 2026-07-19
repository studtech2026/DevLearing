"""
Base repository.

Provides reusable CRUD operations for SQLAlchemy ORM models.
"""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException

ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType]):
    """
    Generic repository implementing reusable CRUD operations.
    """

    def __init__(
        self,
        db: Session,
        model: type[ModelType],
    ):
        self.db = db
        self.model = model

    # =====================================================
    # Read
    # =====================================================

    def get_by_id(
        self,
        record_id: Any,
    ) -> ModelType | None:
        """
        Return a record by primary key.
        """
        return self.db.get(self.model, record_id)

    def get_all(self) -> list[ModelType]:
        """
        Return all records.
        """
        return self.db.query(self.model).all()

    def get_multi(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ModelType]:
        """
        Return paginated records.
        """
        return (
            self.db.query(self.model)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count(self) -> int:
        """
        Return total number of records.
        """
        return self.db.query(self.model).count()

    def exists(
        self,
        record_id: Any,
    ) -> bool:
        """
        Check whether a record exists.
        """
        return self.get_by_id(record_id) is not None

    # =====================================================
    # Create
    # =====================================================

    def create(
        self,
        obj: ModelType,
    ) -> ModelType:
        """
        Insert a new record.
        """
        try:
            self.db.add(obj)
            self.db.commit()
            self.db.refresh(obj)
            return obj

        except SQLAlchemyError as exc:
            self.db.rollback()
            raise DatabaseException(
                "Failed to create record."
            ) from exc

    def create_many(
        self,
        objects: list[ModelType],
    ) -> list[ModelType]:
        """
        Insert multiple records.
        """
        try:
            self.db.add_all(objects)
            self.db.commit()

            for obj in objects:
                self.db.refresh(obj)

            return objects

        except SQLAlchemyError as exc:
            self.db.rollback()
            raise DatabaseException(
                "Failed to create records."
            ) from exc

    # =====================================================
    # Update
    # =====================================================

    def update(
        self,
        obj: ModelType,
    ) -> ModelType:
        """
        Save changes to an existing record.
        """
        try:
            self.db.commit()
            self.db.refresh(obj)
            return obj

        except SQLAlchemyError as exc:
            self.db.rollback()
            raise DatabaseException(
                "Failed to update record."
            ) from exc

    def update_from_dict(
        self,
        obj: ModelType,
        data: dict[str, Any],
    ) -> ModelType:
        """
        Update model fields from a dictionary.
        """
        for key, value in data.items():
            if hasattr(obj, key):
                setattr(obj, key, value)

        return self.update(obj)

    # =====================================================
    # Delete
    # =====================================================

    def delete(
        self,
        obj: ModelType,
    ) -> None:
        """
        Delete a record.
        """
        try:
            self.db.delete(obj)
            self.db.commit()

        except SQLAlchemyError as exc:
            self.db.rollback()
            raise DatabaseException(
                "Failed to delete record."
            ) from exc

    def delete_by_id(
        self,
        record_id: Any,
    ) -> bool:
        """
        Delete a record using its primary key.
        """
        obj = self.get_by_id(record_id)

        if obj is None:
            return False

        self.delete(obj)
        return True