"""
Application dependencies.
"""

from functools import lru_cache

from app.services.ai_service import AIService


@lru_cache(maxsize=1)
def get_ai_service() -> AIService:
    """
    Return a singleton AIService instance.
    """
    return AIService()