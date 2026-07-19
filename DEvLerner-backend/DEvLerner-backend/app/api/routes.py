import os
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.db.database import get_db_connection
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserProfileResponse
from app.utils.auth import create_access_token, decode_access_token, ensure_upload_dir, hash_password, verify_password
from app.core.config import UPLOAD_DIR

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = %s", (str(payload.email),))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(payload.password)
    cur.execute(
        """
        INSERT INTO users (
            name, email, password_hash, username, phone, gender, date_of_birth,
            address, city, state, country, bio
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (
            payload.name,
            str(payload.email),
            hashed_password,
            payload.username,
            payload.phone,
            payload.gender,
            payload.date_of_birth,
            payload.address,
            payload.city,
            payload.state,
            payload.country,
            payload.bio,
        ),
    )
    user_id = cur.fetchone()["id"]
    conn.commit()
    conn.close()

    token = create_access_token({"sub": str(user_id)})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, password_hash FROM users WHERE email = %s", (str(payload.email),))
    user = cur.fetchone()
    conn.close()

    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user["id"])})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserProfileResponse)
def get_me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_access_token(token)
    user_id = int(payload["sub"])

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, name, email, username, phone, gender, date_of_birth,
               address, city, state, country, bio, profile_picture
        FROM users WHERE id = %s
        """,
        (user_id,),
    )
    user = cur.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "username": user["username"],
        "phone": user["phone"],
        "gender": user["gender"],
        "date_of_birth": user["date_of_birth"],
        "address": user["address"],
        "city": user["city"],
        "state": user["state"],
        "country": user["country"],
        "bio": user["bio"],
        "profile_picture": user["profile_picture"],
    }


@router.post("/upload-profile-picture")
def upload_profile_picture(file: UploadFile = File(...), credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_access_token(token)
    user_id = int(payload["sub"])

    ensure_upload_dir()

    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    file_name = f"{user_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE users SET profile_picture = %s WHERE id = %s", (file_name, user_id))
    conn.commit()
    conn.close()

    return {"message": "Profile picture uploaded", "file_name": file_name}
