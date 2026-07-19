"""
Authentication and JWT utilities.

Single source of truth for password hashing and token operations.
Uses PyJWT and bcrypt (see requirements.txt).
"""

from __future__ import annotations

import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt

from app.core.config import settings


# =====================================================
# Password Hashing
# =====================================================


def hash_password(password: str) -> str:
    """
    Hash a plain password using bcrypt.
    """
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except (ValueError, TypeError):
        return False


# =====================================================
# Token Generation
# =====================================================


def _create_token(
    data: dict[str, Any],
    expires_delta: timedelta,
    token_type: str,
) -> str:
    """
    Internal helper to create a signed JWT.
    """
    now = datetime.now(timezone.utc)
    payload = data.copy()
    payload.update(
        {
            "iat": int(now.timestamp()),
            "exp": int((now + expires_delta).timestamp()),
            "type": token_type,
            "jti": str(uuid.uuid4()),
        }
    )
    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a short-lived JWT access token.
    """
    delta = expires_delta or timedelta(
        minutes=settings.access_token_expire_minutes
    )
    return _create_token(data, delta, token_type="access")


def create_refresh_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a long-lived JWT refresh token.
    """
    delta = expires_delta or timedelta(
        days=settings.refresh_token_expire_days
    )
    return _create_token(data, delta, token_type="refresh")


# =====================================================
# Token Decoding
# =====================================================


def decode_token(token: str, expected_type: str) -> dict[str, Any]:
    """
    Decode a JWT and verify its type.

    Raises jwt.PyJWTError on failure.
    """
    payload = jwt.decode(
        token,
        settings.secret_key,
        algorithms=[settings.algorithm],
    )

    if payload.get("type") != expected_type:
        raise jwt.InvalidTokenError(
            f"Expected token type '{expected_type}', "
            f"got '{payload.get('type')}'"
        )

    return payload


def decode_access_token(token: str) -> dict[str, Any]:
    return decode_token(token, expected_type="access")


def decode_refresh_token(token: str) -> dict[str, Any]:
    return decode_token(token, expected_type="refresh")


# =====================================================
# Token Hashing (for at-rest storage)
# =====================================================


def hash_token(token: str) -> str:
    """
    Return a SHA-256 hash of a token. Used to store tokens
    without keeping the raw value.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


# =====================================================
# Random Tokens
# =====================================================


def generate_random_token(length: int = 32) -> str:
    """
    Generate a URL-safe random token (for password resets etc.).
    """
    return secrets.token_urlsafe(length)
