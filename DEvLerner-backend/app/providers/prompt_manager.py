"""
Prompt Builder.

Creates standardized prompts for every AI provider.
"""

from __future__ import annotations


class PromptBuilder:
    """
    Builds prompts for AI providers.
    """

    # ==========================================================
    # Analysis
    # ==========================================================

    @staticmethod
    def build_analysis_prompt(
        code: str,
        language: str,
        task: str,
    ) -> str:
        return f"""
You are a senior {language} software engineer.

Analyze the following source code.

Task:
{task}

IMPORTANT RULES

- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT wrap JSON inside ``` blocks.
- Do NOT explain outside JSON.

Required JSON Schema

{{
    "summary":"",
    "explanation":"",
    "bugs":[
        {{
            "line":"",
            "issue":"",
            "severity":""
        }}
    ],
    "suggestions":[
        ""
    ],
    "complexity":"",
    "optimized_code":"",
    "unit_tests":[
        ""
    ],
    "interview_questions":[
        ""
    ]
}}

Source Code

{code}
"""
    # ==========================================================
    # Optimization
    # ==========================================================

    @staticmethod
    def build_optimization_prompt(
        code: str,
        language: str,
    ) -> str:
        return f"""
You are an expert {language} performance engineer.

Optimize the following code.

Rules

- Improve readability
- Improve performance
- Remove duplicate logic
- Follow best practices
- Preserve behavior

Return ONLY JSON.

{{
    "optimized_code":"",
    "changes":[
        ""
    ],
    "performance_improvement":"",
    "readability_score":""
}}

Code

{code}
"""

    # ==========================================================
    # Conversion
    # ==========================================================

    @staticmethod
    def build_conversion_prompt(
        code: str,
        language: str,
        target_language: str,
    ) -> str:
        return f"""
Convert the following {language} code into {target_language}.

Rules

- Preserve functionality
- Follow {target_language} best practices
- Return ONLY JSON

JSON

{{
    "converted_code":"",
    "notes":""
}}

Source

{code}
"""

    # ==========================================================
    # Repository
    # ==========================================================

    @staticmethod
    def build_repository_prompt(
        repository_url: str,
        branch: str | None,
    ) -> str:
        return f"""
Analyze this Git repository.

Repository

{repository_url}

Branch

{branch or "default"}

Return ONLY JSON.

{{
    "summary":"",
    "architecture":"",
    "strengths":[],
    "weaknesses":[],
    "security":[],
    "recommendations":[]
}}
"""

    # ==========================================================
    # Bug Fix
    # ==========================================================

    @staticmethod
    def build_bug_fix_prompt(
        code: str,
        language: str,
    ) -> str:
        return f"""
Find all bugs in this {language} code.

Return ONLY JSON.

{{
    "fixed_code":"",
    "bugs":[]
}}

Code

{code}
"""

    # ==========================================================
    # Documentation
    # ==========================================================

    @staticmethod
    def build_documentation_prompt(
        code: str,
        language: str,
    ) -> str:
        return f"""
Generate professional documentation for this {language} code.

Return ONLY markdown.

Code

{code}
"""

    # ==========================================================
    # Unit Tests
    # ==========================================================

    @staticmethod
    def build_test_prompt(
        code: str,
        language: str,
    ) -> str:
        return f"""
Generate comprehensive unit tests for this {language} code.

Return ONLY code.

Source

{code}
"""