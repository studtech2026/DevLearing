"""
AI Service.

Coordinates AI operations between the API layer and the configured provider.
"""

from __future__ import annotations

from typing import Any

from app.core.constants import (
    MAX_CODE_LENGTH,
    SUPPORTED_ANALYSIS_TASKS,
    SUPPORTED_LANGUAGES,
)
from app.core.logging import get_logger
from app.providers.provider_factory import ProviderFactory

logger = get_logger(__name__)


class AIService:
    """
    High-level service responsible for AI operations.

    This service validates input, logs requests,
    delegates work to the configured provider,
    and centralizes error handling.
    """

    def __init__(self) -> None:
        self.provider = ProviderFactory.get_provider()

        logger.info(
            "AI Provider initialized: %s",
            self.provider.__class__.__name__,
        )

    # =====================================================
    # Code Analysis
    # =====================================================

    def analyze_code(
        self,
        code: str,
        language: str = "python",
        task: str = "explain",
    ) -> dict[str, Any]:
        """
        Analyze source code.
        """

        self._validate_code(code)
        self._validate_language(language)
        self._validate_task(task)

        logger.info(
            "Analyze Request | Provider=%s | Language=%s | Task=%s",
            self.provider.__class__.__name__,
            language,
            task,
        )

        try:
            response = self.provider.analyze(
                code=code,
                language=language,
                task=task,
            )

            logger.info("Analysis completed successfully.")

            return response

        except Exception as exc:
            logger.exception("Code analysis failed: %s", exc)
            raise

    # =====================================================
    # Code Optimization
    # =====================================================

    def optimize_code(
        self,
        code: str,
        language: str = "python",
    ) -> dict[str, Any]:
        """
        Optimize source code.
        """

        self._validate_code(code)
        self._validate_language(language)

        logger.info(
            "Optimize Request | Provider=%s | Language=%s",
            self.provider.__class__.__name__,
            language,
        )

        try:
            response = self.provider.optimize(
                code=code,
                language=language,
            )

            logger.info("Optimization completed successfully.")

            return response

        except Exception as exc:
            logger.exception("Optimization failed: %s", exc)
            raise

    # =====================================================
    # Code Conversion
    # =====================================================

    def convert_code(
        self,
        code: str,
        language: str = "python",
        target_language: str = "javascript",
    ) -> dict[str, Any]:
        """
        Convert code between programming languages.
        """

        self._validate_code(code)
        self._validate_language(language)
        self._validate_language(target_language)

        logger.info(
            "Convert Request | %s -> %s",
            language,
            target_language,
        )

        try:
            response = self.provider.convert(
                code=code,
                language=language,
                target_language=target_language,
            )

            logger.info("Conversion completed successfully.")

            return response

        except Exception as exc:
            logger.exception("Code conversion failed: %s", exc)
            raise

    # =====================================================
    # Repository Analysis
    # =====================================================

    def analyze_repository(
        self,
        repository_url: str,
        branch: str | None = None,
    ) -> dict[str, Any]:
        """
        Analyze a Git repository.
        """

        self._validate_repository_url(repository_url)

        logger.info(
            "Repository Analysis | URL=%s | Branch=%s",
            repository_url,
            branch or "default",
        )

        try:
            response = self.provider.analyze_repository(
                repository_url=repository_url,
                branch=branch,
            )

            logger.info("Repository analysis completed successfully.")

            return response

        except Exception as exc:
            logger.exception("Repository analysis failed: %s", exc)
            raise

    # =====================================================
    # Provider
    # =====================================================

    def reload_provider(self) -> None:
        """
        Reload configured AI provider.
        """

        self.provider = ProviderFactory.get_provider()

        logger.info(
            "AI Provider reloaded: %s",
            self.provider.__class__.__name__,
        )

    # =====================================================
    # Validation
    # =====================================================

    @staticmethod
    def _validate_code(code: str) -> None:
        """
        Validate source code.
        """

        if not isinstance(code, str):
            raise TypeError("Code must be a string.")

        if not code.strip():
            raise ValueError("Code cannot be empty.")

        if len(code) > MAX_CODE_LENGTH:
            raise ValueError(
                f"Code exceeds maximum length of {MAX_CODE_LENGTH} characters."
            )

    @staticmethod
    def _validate_language(language: str) -> None:
        """
        Validate programming language.
        """

        if language.lower() not in SUPPORTED_LANGUAGES:
            raise ValueError(
                f"Unsupported language '{language}'. "
                f"Supported languages: {', '.join(SUPPORTED_LANGUAGES)}"
            )

    @staticmethod
    def _validate_task(task: str) -> None:
        """
        Validate analysis task.
        """

        if task.lower() not in SUPPORTED_ANALYSIS_TASKS:
            raise ValueError(
                f"Unsupported task '{task}'. "
                f"Supported tasks: {', '.join(SUPPORTED_ANALYSIS_TASKS)}"
            )

    @staticmethod
    def _validate_repository_url(repository_url: str) -> None:
        """
        Validate GitHub repository URL.
        """

        if not isinstance(repository_url, str):
            raise TypeError("Repository URL must be a string.")

        repository_url = repository_url.strip()

        if not repository_url:
            raise ValueError("Repository URL cannot be empty.")

        if not (
            repository_url.startswith("https://github.com/")
            or repository_url.startswith("http://github.com/")
        ):
            raise ValueError(
                "Only GitHub repository URLs are currently supported."
            )