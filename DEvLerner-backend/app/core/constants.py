"""
Application constants.

This file contains all default values and application-wide constants.
"""

# =====================================================
# Environment
# =====================================================

DEFAULT_ENV_FILE = ".env"
DEFAULT_ENV_FILE_ENCODING = "utf-8"

# =====================================================
# Application
# =====================================================

APP_NAME = "DevMentor AI API"
APP_VERSION = "1.0.0"

# =====================================================
# Database
# =====================================================

DEFAULT_DATABASE_URL = "sqlite:///./devmentor.db"

# =====================================================
# JWT
# =====================================================

DEFAULT_SECRET_KEY = (
    "b8c40a676c9b76ebfae04020163556f10639e7e65e0acd4f7012ae5ea4bc266c"
)

DEFAULT_ALGORITHM = "HS256"

DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES = 60

# =====================================================
# Upload
# =====================================================

DEFAULT_UPLOAD_DIR = "uploads"

# =====================================================
# AI
# =====================================================

DEFAULT_AI_PROVIDER = "google"

DEFAULT_GOOGLE_MODEL = "gemini-2.5-flash"

SUPPORTED_AI_PROVIDERS = [
    "google",
]

# =====================================================
# Supported Programming Languages
# =====================================================

SUPPORTED_LANGUAGES = [
    "python",
    "javascript",
    "typescript",
    "java",
    "cpp",
    "c",
    "csharp",
    "go",
    "rust",
    "php",
    "ruby",
    "swift",
    "kotlin",
    "sql",
    "html",
    "css",
]

# =====================================================
# Analysis Tasks
# =====================================================

SUPPORTED_ANALYSIS_TASKS = [
    "review",
    "explain",
    "optimize",
    "bug_fix",
    "refactor",
    "document",
    "complexity",
    "security",
]

# =====================================================
# Repository
# =====================================================

SUPPORTED_GIT_PROVIDERS = [
    "github",
]

# =====================================================
# CORS
# =====================================================

DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

# =====================================================
# Logging
# =====================================================

DEFAULT_LOG_LEVEL = "INFO"

# =====================================================
# API
# =====================================================

API_PREFIX = "/api/v1"

HEALTH_ENDPOINT = "/health"

# =====================================================
# AI Limits
# =====================================================

MAX_CODE_LENGTH = 50000

MAX_REPOSITORY_FILES = 100

MAX_PROMPT_LENGTH = 100000

REQUEST_TIMEOUT = 60