from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    username: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    username: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
