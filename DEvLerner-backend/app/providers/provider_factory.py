"""
Provider Factory.

Creates AI providers based on application configuration.
"""

from __future__ import annotations

from typing import Type

from app.core.config import settings
from app.core.exceptions import AppException
from app.core.logging import get_logger
from app.providers.base_provider import BaseProvider
from app.providers.local_provider import LocalProvider

logger = get_logger(__name__)


class ProviderFactory:
    """
    Factory responsible for creating AI provider instances.
    """

    _providers: dict[str, Type[BaseProvider]] = {
        "local": LocalProvider,
    }

    @classmethod
    def get_provider(cls) -> BaseProvider:
        provider_name = settings.ai_provider.strip().lower()

        if provider_name in {"gemini", "google"}:
            try:
                from app.providers.gemini_provider import GeminiProvider
            except ImportError as exc:
                raise AppException(
                    "Gemini support is not installed. Run "
                    "'pip install -r requirements.txt' or set AI_PROVIDER=local."
                ) from exc
            provider_class: Type[BaseProvider] | None = GeminiProvider
        else:
            provider_class = cls._providers.get(provider_name)

        if provider_class is None:
            raise AppException(
                f"Unsupported AI provider '{provider_name}'. "
                f"Available providers: {', '.join(cls.available_providers())}"
            )

        logger.info("Initializing AI provider: %s", provider_name)

        return provider_class()

    @classmethod
    def available_providers(cls) -> list[str]:
        return sorted([*cls._providers, "gemini", "google"])

    @classmethod
    def is_supported(cls, provider: str) -> bool:
        return provider.lower() in {*cls._providers, "gemini", "google"}
