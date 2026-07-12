from app.schemas.auth import RegisterRequest, LoginRequest
from app.utils.auth import create_access_token, hash_password, verify_password


def test_register_schema_accepts_profile_fields():
    payload = RegisterRequest(
        name="Alice",
        email="alice@example.com",
        password="secret123",
        username="alice",
        phone="1234567890",
        gender="female",
        city="New York",
        country="USA",
        bio="Hello there",
    )
    assert payload.username == "alice"
    assert payload.gender == "female"
    assert payload.city == "New York"


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
