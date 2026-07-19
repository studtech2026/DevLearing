from app.core.security import create_access_token, hash_password, verify_password
from app.schemas.auth import LoginRequest, RegisterRequest


def test_register_schema_accepts_registration_fields():
    payload = RegisterRequest(
        name="Alice",
        email="alice@example.com",
        password="secret123",
        username="alice",
    )
    assert payload.username == "alice"


def test_login_schema_and_password_flow():
    payload = LoginRequest(email="alice@example.com", password="secret123")
    assert payload.email == "alice@example.com"
    hashed = hash_password("secret123")
    assert verify_password("secret123", hashed)


def test_token_generation():
    token = create_access_token({"sub": "1"})
    assert token


if __name__ == "__main__":
    test_register_schema_accepts_profile_fields()
    test_login_schema_and_password_flow()
    test_token_generation()
    print("auth smoke tests passed")
