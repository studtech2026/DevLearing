"""
Authentication service.

Contains all authentication business logic:
- Register / Login / Refresh / Logout
- Forgot / Reset password
- Change password
- Profile picture upload
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import jwt
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import get_logger
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    generate_random_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.models.password_reset import PasswordReset
from app.models.refresh_token import RefreshToken
from app.models.revoked_token import RevokedToken
from app.models.user import User
from app.repositories.password_reset_repository import PasswordResetRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.revoked_token_repository import RevokedTokenRepository
from app.repositories.user_repository import UserRepository

logger = get_logger(__name__)


# =====================================================
# Token Helpers
# =====================================================


def _token_pair_for(user: User) -> dict[str, Any]:
    """
    Build an access/refresh token pair, persist the refresh token
    in the database, and return the response data.
    """
    token_data = {
        "sub": str(user.id),
        "email": user.email,
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.access_token_expire_minutes * 60,
        "_raw_refresh": refresh_token,
        "_user_id": user.id,
    }


# =====================================================
# AuthService
# =====================================================


class AuthService:
    """Handles all authentication operations."""

    def __init__(self, db: Session):
        self.db = db
        self.users = UserRepository(db)
        self.refresh_tokens = RefreshTokenRepository(db)
        self.password_resets = PasswordResetRepository(db)
        self.revoked = RevokedTokenRepository(db)

    # ---------------------------------------------------------
    # Register
    # ---------------------------------------------------------

    def register(
        self,
        name: str,
        email: str,
        password: str,
        username: str | None = None,
    ) -> dict[str, Any]:
        """
        Create a new user and return tokens.
        """
        email_normalized = email.lower().strip()

        if self.users.email_exists(email_normalized):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )

        if username and self.users.username_exists(username):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username is already taken",
            )

        user = User(
            name=name.strip(),
            email=email_normalized,
            username=username.strip() if username else None,
            password_hash=hash_password(password),
            is_active=True,
        )
        user = self.users.create(user)

        logger.info("User registered id=%s email=%s", user.id, user.email)

        pair = _token_pair_for(user)
        self._persist_refresh_token(user.id, pair["_raw_refresh"])

        return {
            "user": user,
            "tokens": {
                "access_token": pair["access_token"],
                "refresh_token": pair["refresh_token"],
                "token_type": pair["token_type"],
                "expires_in": pair["expires_in"],
            },
        }

    # ---------------------------------------------------------
    # Login
    # ---------------------------------------------------------

    def login(
    self,
    identifier: str,
    password: str,
    ) -> dict[str, Any]:
        """
        Authenticate a user using email or username.
        """
        identifier = identifier.strip()

        user = self.users.get_by_email_or_username(identifier)

        if not user or not verify_password(password, user.password_hash):
            logger.warning("Failed login attempt for %s", identifier)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email/username or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive",
            )

        logger.info("User logged in id=%s", user.id)

        pair = _token_pair_for(user)
        self._persist_refresh_token(user.id, pair["_raw_refresh"])

        return {
            "user": user,
            "tokens": {
                "access_token": pair["access_token"],
                "refresh_token": pair["refresh_token"],
                "token_type": pair["token_type"],
                "expires_in": pair["expires_in"],
            },
        }

    # ---------------------------------------------------------
    # Refresh
    # ---------------------------------------------------------

    def refresh(self, refresh_token: str) -> dict[str, Any]:
        """
        Issue a new access + refresh token using a valid refresh token.
        """
        token_hash = hash_token(refresh_token)
        record = self.refresh_tokens.get_by_token_hash(token_hash)

        if not record or record.revoked:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        if record.expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has expired",
            )

        try:
            payload = decode_refresh_token(refresh_token)
        except jwt.PyJWTError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            ) from exc

        user = self.users.get_by_id(record.user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )

        # Rotate: revoke the old refresh token, issue a new pair
        self.refresh_tokens.revoke(record)

        new_pair = _token_pair_for(user)
        self._persist_refresh_token(user.id, new_pair["_raw_refresh"])

        return {
            "user": user,
            "tokens": {
                "access_token": new_pair["access_token"],
                "refresh_token": new_pair["refresh_token"],
                "token_type": new_pair["token_type"],
                "expires_in": new_pair["expires_in"],
            },
        }

    # ---------------------------------------------------------
    # Logout
    # ---------------------------------------------------------

    def logout(
        self,
        user: User,
        access_jti: str | None,
        access_exp_ts: int | None,
        refresh_token: str | None = None,
    ) -> None:
        """
        Invalidate the user's session.

        - Revoke the supplied refresh token (if any) OR all of the user's
          refresh tokens.
        - Add the access token's jti to the blacklist.
        """
        if refresh_token:
            token_hash = hash_token(refresh_token)
            record = self.refresh_tokens.get_by_token_hash(token_hash)
            if record and record.user_id == user.id and not record.revoked:
                record.revoked = True
                self.db.commit()
        else:
            self.refresh_tokens.revoke_all_for_user(user.id)

        if access_jti and access_exp_ts:
            expires_at = datetime.fromtimestamp(access_exp_ts, tz=timezone.utc)
            if expires_at > datetime.now(timezone.utc):
                self.revoked.create(
                    RevokedToken(jti=access_jti, expires_at=expires_at)
                )

    # ---------------------------------------------------------
    # Change Password
    # ---------------------------------------------------------

    def change_password(
        self,
        user: User,
        current_password: str,
        new_password: str,
    ) -> None:
        if not verify_password(current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            )

        if current_password == new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be different from current password",
            )

        user.password_hash = hash_password(new_password)
        self.users.update(user)

        # Force re-authentication on all other devices
        self.refresh_tokens.revoke_all_for_user(user.id)
        logger.info("Password changed for user id=%s", user.id)

    # ---------------------------------------------------------
    # Forgot / Reset Password
    # ---------------------------------------------------------

    def forgot_password(self, email: str) -> dict[str, Any]:
        """
        Generate a one-time reset token.

        For security, the response is the same whether the email exists
        or not. In dev mode the token is returned so the user can test.
        """
        email_normalized = email.lower().strip()
        user = self.users.get_by_email(email_normalized)

        dev_token: str | None = None
        reset_window_minutes = 30

        if user and user.is_active:
            raw_token = generate_random_token(32)
            token_hash = hash_token(raw_token)
            expires_at = datetime.now(timezone.utc) + timedelta(
                minutes=reset_window_minutes
            )

            self.password_resets.create(
                PasswordReset(
                    user_id=user.id,
                    token_hash=token_hash,
                    expires_at=expires_at,
                    used=False,
                )
            )

            logger.info(
                "Password reset token issued for user id=%s", user.id
            )

            if settings.environment.lower() in ("development", "dev", "test"):
                dev_token = raw_token

        return {
            "dev_reset_token": dev_token,
            "expires_in_minutes": reset_window_minutes,
        }

    def reset_password(self, token: str, new_password: str) -> None:
        token_hash = hash_token(token)
        record = self.password_resets.get_by_token_hash(token_hash)

        if (
            not record
            or record.used
            or record.expires_at < datetime.now(timezone.utc)
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token",
            )

        user = self.users.get_by_id(record.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User no longer exists",
            )

        user.password_hash = hash_password(new_password)
        self.users.update(user)

        record.used = True
        self.db.commit()

        # Force re-login
        self.refresh_tokens.revoke_all_for_user(user.id)
        logger.info("Password reset completed for user id=%s", user.id)

    # ---------------------------------------------------------
    # Profile
    # ---------------------------------------------------------

    def update_profile(self, user: User, data: dict) -> User:
        allowed_fields = {
                "name",
                "username",
                "phone",
                "gender",
                "date_of_birth",
                "address",
                "city",
                "state",
                "country",
                "bio",
            }

        for field, value in data.items():
            if field not in allowed_fields:
                continue
            if value is None:
                continue
            if field == "username":
                if (
                    value != user.username
                    and self.users.username_exists(value)
                ):
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Username is already taken",
                    )
            setattr(user, field, value)

        return self.users.update(user)

    def upload_profile_picture(
        self,
        user: User,
        upload: UploadFile,
    ) -> str:
        """
        Save the uploaded image to UPLOAD_DIR/profile_pictures and
        update the user record.
        """
        if not upload.content_type or not upload.content_type.startswith(
            "image/"
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file must be an image",
            )

        upload_dir = Path(settings.upload_dir) / "profile_pictures"
        upload_dir.mkdir(parents=True, exist_ok=True)

        allowed_extensions = {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        }

        ext = Path(upload.filename or "").suffix.lower()

        if ext not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported image format",
            )

        filename = (
            f"user_{user.id}_"
            f"{int(datetime.now(timezone.utc).timestamp())}"
            f"{ext}"
        )
        
        filename = f"user_{user.id}_{int(datetime.now(timezone.utc).timestamp())}{ext}"
        file_path = upload_dir / filename

        contents = upload.file.read()
        if len(contents) > settings.max_upload_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File exceeds maximum allowed size",
            )

        file_path.write_bytes(contents)

        relative_url = f"/uploads/profile_pictures/{filename}"
        user.profile_picture = relative_url
        self.users.update(user)
        logger.info("Profile picture updated for user id=%s", user.id)
        return relative_url

    # ---------------------------------------------------------
    # Internal
    # ---------------------------------------------------------

    def _persist_refresh_token(self, user_id: int, raw_token: str) -> None:
        token_hash = hash_token(raw_token)
        expires_at = datetime.now(timezone.utc) + timedelta(
            days=settings.refresh_token_expire_days
        )
        self.refresh_tokens.create(
            RefreshToken(
                user_id=user_id,
                token_hash=token_hash,
                expires_at=expires_at,
                revoked=False,
            )
        )
