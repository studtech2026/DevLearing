"""
Base interface for AI providers.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class BaseProvider(ABC):
    """
    Abstract interface for AI providers.

    Every provider (Gemini, OpenAI, Claude, Azure OpenAI, etc.)
    must implement this interface.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """
        Return the provider name.
        Example:
            Gemini
            OpenAI
            Claude
        """
        raise NotImplementedError

    @abstractmethod
    def health_check(self) -> bool:
        """
        Verify the provider is available.

        Returns:
            bool
        """
        raise NotImplementedError

    @abstractmethod
    def analyze(
        self,
        code: str,
        language: str,
        task: str,
    ) -> dict[str, Any]:
        """
        Analyze source code.

        Returns:
            Standardized response dictionary.
        """
        raise NotImplementedError

    @abstractmethod
    def optimize(
        self,
        code: str,
        language: str,
    ) -> dict[str, Any]:
        """
        Optimize source code.

        Returns:
            Standardized response dictionary.
        """
        raise NotImplementedError

    @abstractmethod
    def convert(
        self,
        code: str,
        language: str,
        target_language: str,
    ) -> dict[str, Any]:
        """
        Convert code into another programming language.

        Returns:
            Standardized response dictionary.
        """
        raise NotImplementedError

    @abstractmethod
    def analyze_repository(
        self,
        repository_url: str,
        branch: str | None = None,
    ) -> dict[str, Any]:
        """
        Analyze an entire Git repository.

        Returns:
            Standardized response dictionary.
        """
        raise NotImplementedError

    @abstractmethod
    def generate(
        self,
        prompt: str,
        **kwargs: Any,
    ) -> str:
        """
        Generate raw text from a prompt.

        This method is used internally by the higher-level
        analyze/optimize/convert methods.
        """
        raise NotImplementedError