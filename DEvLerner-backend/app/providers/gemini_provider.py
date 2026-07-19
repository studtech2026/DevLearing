"""
Gemini Provider.

Handles communication with Google's Gemini models.
"""

from __future__ import annotations

from typing import Any

import google.generativeai as genai

from app.core.config import settings
from app.core.logging import get_logger
from app.parsers.ai_response_parser import AIResponseParser
from app.prompts.prompt_builder import PromptBuilder
from app.providers.base_provider import BaseProvider
from app.providers.local_provider import LocalProvider

logger = get_logger(__name__)


class GeminiProvider(BaseProvider):
    """
    Google Gemini AI Provider.
    """

    def __init__(self) -> None:
        if not settings.google_api_key:
            raise ValueError(
                "GOOGLE_API_KEY is missing. Configure it in your .env file."
            )

        genai.configure(api_key=settings.google_api_key)

        self.model = genai.GenerativeModel(
            model_name=settings.google_model,
        )

        logger.info(
            "Gemini initialized using model: %s",
            settings.google_model,
        )

    # =====================================================
    # Base Provider
    # =====================================================

    @property
    def provider_name(self) -> str:
        return "gemini"

    def health_check(self) -> bool:
        """
        Check whether Gemini is available.
        """
        try:
            self.model.generate_content("Hello")
            return True
        except Exception:
            return False

    def generate(
        self,
        prompt: str,
        **kwargs: Any,
    ) -> str:
        """
        Generate plain text from Gemini.
        """

        response = self.model.generate_content(
            prompt,
            generation_config={
                "temperature": kwargs.get(
                    "temperature",
                    settings.temperature,
                ),
                "max_output_tokens": kwargs.get(
                    "max_output_tokens",
                    settings.max_tokens,
                ),
            },
        )

        if (
            response is None
            or not hasattr(response, "text")
            or not response.text
        ):
            raise ValueError("Gemini returned an empty response.")

        return response.text

    # =====================================================
    # Analyze
    # =====================================================

    def analyze(
        self,
        code: str,
        language: str,
        task: str,
    ) -> dict[str, Any]:

        prompt = PromptBuilder.build_analysis_prompt(
            code=code,
            language=language,
            task=task,
        )

        return self._generate_json(
            prompt=prompt,
            fallback_code=code,
            language=language,
            task=task,
        )

    # =====================================================
    # Optimize
    # =====================================================

    def optimize(
        self,
        code: str,
        language: str,
    ) -> dict[str, Any]:

        prompt = PromptBuilder.build_optimization_prompt(
            code=code,
            language=language,
        )

        return self._generate_text(prompt)

    # =====================================================
    # Convert
    # =====================================================

    def convert(
        self,
        code: str,
        language: str,
        target_language: str,
    ) -> dict[str, Any]:

        prompt = PromptBuilder.build_conversion_prompt(
            code=code,
            language=language,
            target_language=target_language,
        )

        return self._generate_text(prompt)

    # =====================================================
    # Repository
    # =====================================================

    def analyze_repository(
        self,
        repository_url: str,
        branch: str | None = None,
    ) -> dict[str, Any]:

        prompt = f"""
Analyze the following GitHub repository.

Repository:
{repository_url}

Branch:
{branch or "default"}

Return ONLY valid JSON.
"""

        return self._generate_json(
            prompt=prompt,
            fallback_code="",
            language="repository",
            task="repository_analysis",
        )

    # =====================================================
    # Internal
    # =====================================================

    def _generate_json(
        self,
        prompt: str,
        fallback_code: str,
        language: str,
        task: str,
    ) -> dict[str, Any]:

        logger.info("Sending JSON request to Gemini")

        try:
            text = self.generate(prompt)

            return AIResponseParser.parse(text)

        except Exception as exc:

            logger.exception(
                "Gemini JSON generation failed: %s",
                exc,
            )

            logger.info(
                "Falling back to LocalProvider"
            )

            return LocalProvider().analyze(
                code=fallback_code,
                language=language,
                task=task,
            )

    def _generate_text(
        self,
        prompt: str,
    ) -> dict[str, Any]:

        logger.info("Sending text request to Gemini")

        try:

            text = self.generate(prompt)

            return {
                "success": True,
                "provider": self.provider_name,
                "result": text,
            }

        except Exception as exc:

            logger.exception(
                "Gemini text generation failed: %s",
                exc,
            )

            return {
                "success": False,
                "provider": self.provider_name,
                "result": "",
                "error": str(exc),
            }