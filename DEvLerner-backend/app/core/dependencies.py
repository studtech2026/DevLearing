"""
Reusable FastAPI dependencies.
"""

from __future__ import annotations

from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.core.security import decode_access_token
from app.db.session import SessionLocal
from app.models.user import User
from app.repositories.revoked_token_repository import RevokedTokenRepository
from app.repositories.user_repository import UserRepository

logger = get_logger(__name__)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
)


# =====================================================
# Database Dependency
# =====================================================

def get_db() -> Generator[Session, None, None]:
    """
    Provide a SQLAlchemy session.
    """
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =====================================================
# Helpers
# =====================================================

def _unauthorized(message: str) -> HTTPException:
    """
    Return a standard 401 exception.
    """
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=message,
        headers={"WWW-Authenticate": "Bearer"},
    )


# =====================================================
# Current User
# =====================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Return the authenticated user.
    """

    try:
        payload = decode_access_token(token)

    except PyJWTError:
        logger.warning("Invalid JWT token received")
        raise _unauthorized("Invalid or expired token")

    user_id = payload.get("sub")
    jti = payload.get("jti")

    if not user_id:
        raise _unauthorized("Invalid token payload")

    revoked_repo = RevokedTokenRepository(db)

    if jti and revoked_repo.is_revoked(jti):
        logger.warning("Revoked token used")
        raise _unauthorized("Token has been revoked")

    try:
        user = UserRepository(db).get_by_id(int(user_id))

    except ValueError:
        raise _unauthorized("Invalid token payload")

    if user is None:
        raise _unauthorized("User not found")

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return user