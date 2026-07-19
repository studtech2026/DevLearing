"""
Fallback AI provider.

Used when external AI providers are unavailable.
"""

from __future__ import annotations

from typing import Any

from app.providers.base_provider import BaseProvider


class LocalProvider(BaseProvider):
    """
    Offline fallback provider.

    Returns deterministic responses so the application
    continues to work even if Gemini/OpenAI are unavailable.
    """

    @property
    def provider_name(self) -> str:
        return "local"

    def health_check(self) -> bool:
        return True

    def generate(
        self,
        prompt: str,
        **kwargs: Any,
    ) -> str:
        """
        Local providers do not generate AI responses.
        """
        return (
            "Local provider is active. "
            "Configure an external AI provider for full functionality."
        )

    def analyze(
        self,
        code: str,
        language: str,
        task: str,
    ) -> dict[str, Any]:
        lines = len(code.splitlines())

        return {
            "success": True,
            "provider": self.provider_name,
            "summary": f"{language.title()} code received.",
            "task": task,
            "explanation": (
                "Basic static analysis completed. "
                "Enable Gemini or another AI provider for detailed results."
            ),
            "bugs": [],
            "suggestions": [],
            "complexity": "Estimated O(n)",
            "unit_tests": [],
            "interview_questions": [],
            "statistics": {
                "lines": lines,
                "characters": len(code),
            },
        }

    def optimize(
        self,
        code: str,
        language: str,
    ) -> dict[str, Any]:
        return {
            "success": True,
            "provider": self.provider_name,
            "optimized_code": code,
            "message": (
                "Optimization is unavailable in local mode."
            ),
        }

    def convert(
        self,
        code: str,
        language: str,
        target_language: str,
    ) -> dict[str, Any]:
        return {
            "success": True,
            "provider": self.provider_name,
            "converted_code": "",
            "message": (
                "Language conversion requires an AI provider."
            ),
        }

    def analyze_repository(
        self,
        repository_url: str,
        branch: str | None = None,
    ) -> dict[str, Any]:
        return {
            "success": True,
            "provider": self.provider_name,
            "summary": (
                "Repository analysis is unavailable in local mode."
            ),
            "repository": repository_url,
            "branch": branch,
            "files": [],
            "statistics": {},
        }