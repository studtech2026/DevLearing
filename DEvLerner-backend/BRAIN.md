# DevLerner Backend Brain File

## Project purpose
This project is a FastAPI-based authentication backend for DevLerner. It supports:
- user registration
- user login with JWT
- protected user profile access
- profile picture upload
- extended user profile fields

## Main stack
- Python 3.12
- FastAPI
- PostgreSQL
- psycopg2-binary
- JWT authentication
- bcrypt password hashing

## Project structure
- app/main.py: FastAPI app entry point
- app/api/routes.py: authentication and profile routes
- app/core/config.py: environment configuration
- app/db/database.py: PostgreSQL connection helper
- app/schemas/auth.py: request/response models
- app/utils/auth.py: password and token helpers
- init_db.py: database table initialization
- uploads/profile_pictures: folder for uploaded profile pictures

## Database table
The main table is users with fields such as:
- id
- name
- email
- password_hash
- username
- phone
- gender
- date_of_birth
- address
- city
- state
- country
- bio
- profile_picture
- is_active
- created_at
- updated_at

## Environment variables
Use a .env file with:
- DATABASE_URL
- SECRET_KEY
- ALGORITHM
- ACCESS_TOKEN_EXPIRE_MINUTES
- UPLOAD_DIR

## Run locally
1. Create a PostgreSQL database
2. Set .env values
3. Run: python init_db.py
4. Run: python main.py
5. Visit: http://127.0.0.1:8000/docs

## Notes
- Profile pictures are stored as {user_id}{extension} in uploads/profile_pictures
- The filename is saved in the users.profile_picture column
