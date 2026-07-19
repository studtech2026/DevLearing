# # DevLerner Auth Backend

A FastAPI-based authentication backend for user registration, login, profile retrieval, and profile picture upload.

## Features

- User registration with secure password hashing
- Email/password login returning JWT access tokens
- Protected `/me` endpoint to fetch authenticated user profile
- Profile picture upload for authenticated users
- PostgreSQL database support

## API Endpoints

Base URL: `/api`

### Register

- Method: `POST`
- Path: `/api/register`
- Request body:
  - `name` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `username` (string, optional)
  - `phone` (string, optional)
  - `gender` (string, optional)
  - `date_of_birth` (string, optional)
  - `address` (string, optional)
  - `city` (string, optional)
  - `state` (string, optional)
  - `country` (string, optional)
  - `bio` (string, optional)
- Response:
  - `access_token` (JWT string)
  - `token_type` (`bearer`)

### Login

- Method: `POST`
- Path: `/api/login`
- Request body:
  - `email` (string, required)
  - `password` (string, required)
- Response:
  - `access_token` (JWT string)
  - `token_type` (`bearer`)

### Get Current User

- Method: `GET`
- Path: `/api/me`
- Authorization: `Bearer <access_token>` header
- Response: user profile fields

### Upload Profile Picture

- Method: `POST`
- Path: `/api/upload-profile-picture`
- Authorization: `Bearer <access_token>` header
- Upload field: `file` (multipart file upload)
- Response:
  - `message`
  - `file_name`

## Project Structure

- `app/main.py` — FastAPI application entrypoint
- `app/api/routes.py` — authentication routes
- `app/utils/auth.py` — password hashing and JWT helpers
- `app/schemas/auth.py` — request/response Pydantic models
- `app/core/config.py` — environment configuration
- `app/db/database.py` — database connection helpers

## Setup

1. Create and activate a virtual environment:

```bash
python -m venv .venv
.\.venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file at the project root with the following values:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/devlerner
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=uploads/profile_pictures
```

4. Ensure your PostgreSQL database is available and the `users` table exists with matching columns.

5. Start the app:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Authentication Details

- Passwords are hashed using `bcrypt` with a randomized salt.
- JWT access tokens are signed with `SECRET_KEY` and `ALGORITHM`.
- Tokens expire after `ACCESS_TOKEN_EXPIRE_MINUTES`.

## Notes

- The app uses `/api` prefix for all auth endpoints.
- The health check endpoint is available at `/health`.
- Uploaded profile pictures are stored in the directory configured by `UPLOAD_DIR`.

## Testing

Run tests using:

```bash
pytest
```
