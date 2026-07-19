"""
Reusable validators.
"""


class Validator:

    @staticmethod
    def not_empty(value: str):

        if not value.strip():
            raise ValueError(
                "Value cannot be empty."
            )