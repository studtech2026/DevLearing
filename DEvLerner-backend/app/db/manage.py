"""
Database management CLI.

Usage:
    python -m app.db.manage init      # Create all tables
    python -m app.db.manage drop      # Drop all tables
    python -m app.db.manage reset     # Drop + recreate
    python -m app.db.manage seed      # Create a test user
    python -m app.db.manage status    # Show row counts
    python -m app.db.manage cleanup   # Remove expired tokens
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import psycopg2
from psycopg2.extras import RealDictCursor

from app.core.config import settings
from app.core.logging import get_logger, setup_logging
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import (  # noqa: F401  (import for metadata)
    PasswordReset,
    RefreshToken,
    RevokedToken,
    User,
)
from app.repositories.password_reset_repository import PasswordResetRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.revoked_token_repository import RevokedTokenRepository

setup_logging()
logger = get_logger(__name__)


# =====================================================
# Helpers
# =====================================================


def _connection():
    return psycopg2.connect(
        settings.database_url, cursor_factory=RealDictCursor
    )


# =====================================================
# Commands
# =====================================================


def cmd_init() -> None:
    """Create all tables (idempotent)."""
    logger.info("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("✓ Tables created")
    cmd_status()


def cmd_drop() -> None:
    """Drop all tables."""
    confirm = input(
        "This will DROP ALL TABLES. Type 'yes' to continue: "
    )
    if confirm.strip().lower() != "yes":
        print("Aborted.")
        return
    logger.info("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    logger.info("✓ Tables dropped")


def cmd_reset() -> None:
    """Drop and recreate all tables."""
    cmd_drop()
    cmd_init()


def cmd_seed() -> None:
    """Insert a test user."""
    db = SessionLocal()
    try:
        from app.repositories.user_repository import UserRepository

        repo = UserRepository(db)
        email = "test@devlerner.com"
        if repo.email_exists(email):
            print(f"✓ Test user already exists: {email}")
            return

        user = User(
            name="Test User",
            email=email,
            username="testuser",
            password_hash=hash_password("Test1234!"),
            is_active=True,
        )
        repo.create(user)
        print("✓ Test user created:")
        print(f"    email:    {email}")
        print(f"    password: Test1234!")
    finally:
        db.close()


def cmd_status() -> None:
    """Show row counts for every table."""
    db = SessionLocal()
    try:
        tables = [
            ("users", User),
            ("refresh_tokens", RefreshToken),
            ("password_resets", PasswordReset),
            ("revoked_tokens", RevokedToken),
        ]
        print("\nDatabase status")
        print("=" * 50)
        print(f"{'table':<22} {'rows':>10}")
        print("-" * 50)
        for name, model in tables:
            count = db.query(model).count()
            print(f"{name:<22} {count:>10}")
        print("=" * 50)
    finally:
        db.close()


def cmd_cleanup() -> None:
    """Remove expired refresh, reset, and revoked tokens."""
    db = SessionLocal()
    try:
        r1 = RefreshTokenRepository(db).delete_expired()
        r2 = PasswordResetRepository(db).delete_expired()
        r3 = RevokedTokenRepository(db).delete_expired()
        print(
            f"✓ Cleanup complete: {r1} refresh tokens, "
            f"{r2} reset tokens, {r3} revoked tokens removed"
        )
    finally:
        db.close()


def cmd_check_connection() -> bool:
    """Test the database connection. Exits on failure."""
    try:
        with _connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT version();")
                version = cur.fetchone()
                print(f"✓ Connected to PostgreSQL: {version['version']}")
        return True
    except Exception as exc:
        print(f"✗ Cannot connect to database: {exc}")
        print(
            f"  DATABASE_URL={settings.database_url}\n"
            "  Make sure PostgreSQL is running and the database exists."
        )
        return False


# =====================================================
# Entry point
# =====================================================


def main() -> int:
    parser = argparse.ArgumentParser(
        description="DevLerner database management CLI",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("init", help="Create all tables")
    sub.add_parser("drop", help="Drop all tables")
    sub.add_parser("reset", help="Drop and recreate all tables")
    sub.add_parser("seed", help="Insert a test user")
    sub.add_parser("status", help="Show table row counts")
    sub.add_parser("cleanup", help="Remove expired tokens")
    sub.add_parser("check", help="Test the database connection")

    args = parser.parse_args()

    handlers = {
        "init": lambda: cmd_init(),
        "drop": lambda: cmd_drop(),
        "reset": lambda: cmd_reset(),
        "seed": lambda: cmd_seed(),
        "status": lambda: cmd_status(),
        "cleanup": lambda: cmd_cleanup(),
        "check": lambda: cmd_check_connection(),
    }

    handler = handlers.get(args.command)
    if handler is None:
        parser.print_help()
        return 1

    # All commands except 'check' need a working DB connection
    if args.command != "check" and not cmd_check_connection():
        return 1

    handler()
    return 0


if __name__ == "__main__":
    sys.exit(main())
