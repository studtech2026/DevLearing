"""
Prompt validation.
"""

from app.prompts.languages import SUPPORTED_LANGUAGES
from app.prompts.tasks import SUPPORTED_TASKS


class PromptValidator:

    @staticmethod
    def validate_language(language: str) -> None:

        if language.lower() not in SUPPORTED_LANGUAGES:
            raise ValueError(
                f"Unsupported language: {language}"
            )

    @staticmethod
    def validate_task(task: str) -> None:

        if task.lower() not in SUPPORTED_TASKS:
            raise ValueError(
                f"Unsupported task: {task}"
            )