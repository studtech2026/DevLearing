"""
Prompt templates.
"""

ANALYSIS_TEMPLATE = """
You are a Senior {language} Software Engineer.

Task:
{task}

Rules:

1. Return ONLY valid JSON.
2. Never return markdown.
3. Never explain outside JSON.

Required JSON:

{{
    "summary":"",
    "explanation":"",
    "bugs":[],
    "complexity":"",
    "unit_tests":[],
    "interview_questions":[]
}}

Code:

{code}
"""

OPTIMIZATION_TEMPLATE = """
Optimize this {language} code.

Requirements:

- Better readability
- Better performance
- Follow best practices
- Preserve functionality

Return ONLY code.

{code}
"""

CONVERSION_TEMPLATE = """
Convert this {language} code into {target_language}.

Requirements:

- Keep same logic
- Use idiomatic {target_language}
- Return ONLY code

Code:

{code}
"""