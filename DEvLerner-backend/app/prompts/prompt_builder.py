"""
Prompt Builder.

Responsible for building prompts for all AI providers.
"""

from __future__ import annotations

from app.prompts.templates import (
    ANALYSIS_TEMPLATE,
    CONVERSION_TEMPLATE,
    OPTIMIZATION_TEMPLATE,
)
from app.prompts.validator import PromptValidator


class PromptBuilder:
    """
    Builds validated prompts for AI providers.
    """

    @staticmethod
    def build_analysis_prompt(
        code: str,
        language: str,
        task: str,
    ) -> str:
        """
        Build an analysis prompt.
        """

        PromptValidator.validate_language(language)
        PromptValidator.validate_task(task)

        return ANALYSIS_TEMPLATE.format(
            language=language.strip(),
            task=task.strip(),
            code=code.strip(),
        )

    @staticmethod
    def build_optimization_prompt(
        code: str,
        language: str,
    ) -> str:
        """
        Build a code optimization prompt.
        """

        PromptValidator.validate_language(language)

        return OPTIMIZATION_TEMPLATE.format(
            language=language.strip(),
            code=code.strip(),
        )

    @staticmethod
    def build_conversion_prompt(
        code: str,
        language: str,
        target_language: str,
    ) -> str:
        """
        Build a language conversion prompt.
        """

        PromptValidator.validate_language(language)
        PromptValidator.validate_language(target_language)

        return CONVERSION_TEMPLATE.format(
            language=language.strip(),
            target_language=target_language.strip(),
            code=code.strip(),
        )