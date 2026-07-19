from app.services.ai_service import AIService


def test_analysis_response_contains_expected_sections():
    service = AIService()
    response = service.analyze_code(
        code="def add(a, b):\n    return a + b\n",
        language="python",
        task="explain",
    )

    assert response["summary"]
    assert response["explanation"]
    assert response["bugs"] == []
    assert response["complexity"]
    assert response["unit_tests"] == []
    assert response["interview_questions"] == []


def test_optimize_code_returns_actionable_output():
    service = AIService()
    response = service.optimize_code(
        code="def sum_values(values):\n    total = 0\n    for item in values:\n        total += item\n    return total\n",
        language="python",
    )

    assert response["optimized_code"]
    assert response["message"]


def test_fallback_accepts_java_code():
    service = AIService()
    java_code = (
        'public class OrderService {\n'
        '    public boolean isEligible(String status) {\n'
        '        return status == "ACTIVE";\n'
        '    }\n'
        '}\n'
    )

    response = service.analyze_code(code=java_code, language="java", task="explain")

    assert response["provider"] == "local"
    assert response["bugs"] == []


def test_fallback_accepts_javascript_code():
    service = AIService()
    js_code = (
        'function buildRequest(user, items) {\n'
        '  return JSON.stringify({\n'
        '    action: "submitOrder",\n'
        '    payload: JSON.stringify({ user, items })\n'
        '  });\n'
        '}\n'
    )

    response = service.analyze_code(code=js_code, language="javascript", task="explain")

    assert response["provider"] == "local"
    assert response["bugs"] == []
