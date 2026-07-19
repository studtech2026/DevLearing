import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/devlerner")
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads/profile_pictures")
