# DevMentor AI Backend Brain File

## Project purpose
DevMentor AI is an AI-powered developer assistant for students and beginner programmers. This backend provides a modular FastAPI foundation for:
- user authentication and profile management
- code explanation and line-by-line teaching support
- bug detection and logic review
- optimization suggestions
- complexity analysis
- unit test generation
- code conversion
- repository analysis

## Main stack
- Python 3.12+
- FastAPI
- PostgreSQL
- psycopg2-binary
- python-dotenv
- JWT authentication via PyJWT
- bcrypt password hashing
- python-multipart for uploads
- requests for Google Gemini REST integration

## Core architecture
- app/main.py: FastAPI app factory and router registration
- app/api/routes.py: API endpoints for auth and AI features
- app/services/ai_service.py: AI orchestration service
- app/schemas/ai.py: AI request/response schemas
- app/core/config.py: environment-driven config
- app/db/database.py: database connectivity
- app/utils/auth.py: security helpers
- tests/: regression and smoke coverage

## AI module strategy
- Default mode is local fallback so the backend still runs without credentials.
- When AI_PROVIDER=google and GOOGLE_API_KEY is present, the backend calls the Google Gemini API.
- The AI service is decoupled from the routes so you can later swap in LangChain, Vertex AI, or another model provider.

## Planned product capabilities
- Explain code line by line
- Detect syntax and logical bugs
- Suggest optimized code
- Analyze time and space complexity
- Generate interview questions
- Generate unit tests
- Convert code between languages
- Analyze GitHub repositories

## Database schema
The users table includes:
- id (SERIAL PRIMARY KEY)
- name
- email (unique)
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
Required values:
- DATABASE_URL
- SECRET_KEY
- ALGORITHM
- ACCESS_TOKEN_EXPIRE_MINUTES
- UPLOAD_DIR
- AI_PROVIDER
- GOOGLE_API_KEY
- GOOGLE_MODEL

## Run locally
1. Create and activate a virtual environment
2. Install requirements
3. Create .env from .env.example
4. Run python init_db.py
5. Start with python main.py
6. Use http://127.0.0.1:8000/docs

## Important implementation notes
- All auth and AI endpoints are mounted under /api.
- JWT tokens are validated for expiry and signature.
- AI responses are structured so the frontend can consume them consistently.
- The current version is intentionally modular and easy to extend for reports, chat history, and repository ingestion.
