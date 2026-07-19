"""
Application configuration.

Loads configuration from environment variables and `.env`.
"""

from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.constants import (
    DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES,
    DEFAULT_AI_PROVIDER,
    DEFAULT_ALGORITHM,
    DEFAULT_CORS_ORIGINS,
    DEFAULT_DATABASE_URL,
    DEFAULT_ENV_FILE,
    DEFAULT_ENV_FILE_ENCODING,
    DEFAULT_GOOGLE_MODEL,
    DEFAULT_SECRET_KEY,
    DEFAULT_UPLOAD_DIR,
)


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=DEFAULT_ENV_FILE,
        env_file_encoding=DEFAULT_ENV_FILE_ENCODING,
        extra="ignore",
        case_sensitive=False,
    )

    # =====================================================
    # Application
    # =====================================================

    app_name: str = "DevMentor AI API"

    app_version: str = "1.0.0"

    debug: bool = False

    @field_validator("debug", mode="before")
    @classmethod
    def normalize_debug(cls, value: object) -> object:
        """Accept common deployment labels as a disabled debug setting."""
        if isinstance(value, str) and value.strip().lower() in {
            "release",
            "production",
            "prod",
        }:
            return False
        return value

    environment: str = "development"

    log_level: str = "INFO"

    # =====================================================
    # Database
    # =====================================================

    database_url: str = Field(DEFAULT_DATABASE_URL)

    # =====================================================
    # JWT
    # =====================================================

    secret_key: str = Field(DEFAULT_SECRET_KEY)

    algorithm: str = Field(DEFAULT_ALGORITHM)

    access_token_expire_minutes: int = Field(
        DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES
    )

    refresh_token_expire_days: int = 7
    
    # =====================================================
    # API
    # =====================================================

    api_v1_prefix: str = "/api/v1"

    request_timeout: int = 60

    allowed_hosts: list[str] = Field(
        default_factory=lambda: [
            "localhost",
            "127.0.0.1",
        ]
    )
    
    # =====================================================
    # Cache
    # =====================================================

    redis_url: str | None = None
    # =====================================================
    # Upload
    # =====================================================

    upload_dir: str = Field(DEFAULT_UPLOAD_DIR)
    max_request_size: int = 20 * 1024 * 1024  # 20 MB

    # =====================================================
    # AI
    # =====================================================

    ai_provider: str = Field(DEFAULT_AI_PROVIDER)

    # Gemini
    google_api_key: str | None = None
    google_model: str = Field(DEFAULT_GOOGLE_MODEL)

    # Future Providers
    openai_api_key: str | None = None
    deepseek_api_key: str | None = None

    # AI Configuration
    max_tokens: int = 4096
    temperature: float = 0.7

    # =====================================================
    # GitHub
    # =====================================================

    github_token: str | None = None

    github_api_url: str = "https://api.github.com"

    # =====================================================
    # CORS
    # =====================================================

    cors_origins: list[str] = Field(default_factory=lambda: DEFAULT_CORS_ORIGINS)

    # =====================================================
    # File Upload
    # =====================================================

    max_upload_size: int = 10 * 1024 * 1024  # 10 MB

    allowed_file_extensions: list[str] = Field(
        default_factory=lambda: [
            ".pdf",
            ".docx",
            ".txt",
            ".md",
            ".py",
            ".js",
            ".ts",
            ".jsx",
            ".tsx",
            ".java",
            ".cpp",
            ".c",
            ".cs",
            ".json",
        ]
    )

@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()


settings = get_settings()

# =====================================================
# Export commonly used settings
# =====================================================

APP_NAME = settings.app_name
APP_VERSION = settings.app_version
DEBUG = settings.debug
ENVIRONMENT = settings.environment
LOG_LEVEL = settings.log_level

DATABASE_URL = settings.database_url

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

UPLOAD_DIR = settings.upload_dir

AI_PROVIDER = settings.ai_provider
GOOGLE_API_KEY = settings.google_api_key
GOOGLE_MODEL = settings.google_model

GITHUB_TOKEN = settings.github_token

CORS_ORIGINS = settings.cors_origins
OPENAI_API_KEY = settings.openai_api_key
DEEPSEEK_API_KEY = settings.deepseek_api_key

MAX_TOKENS = settings.max_tokens
TEMPERATURE = settings.temperature

GITHUB_API_URL = settings.github_api_url

MAX_UPLOAD_SIZE = settings.max_upload_size
ALLOWED_FILE_EXTENSIONS = settings.allowed_file_extensions


REFRESH_TOKEN_EXPIRE_DAYS = settings.refresh_token_expire_days

API_V1_PREFIX = settings.api_v1_prefix

REDIS_URL = settings.redis_url

REQUEST_TIMEOUT = settings.request_timeout

ALLOWED_HOSTS = settings.allowed_hosts

MAX_REQUEST_SIZE = settings.max_request_size
