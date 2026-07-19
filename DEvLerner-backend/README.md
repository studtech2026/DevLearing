# DevMentor AI Backend

A production-ready FastAPI backend starter for the DevMentor AI platform. It combines authentication, file uploads, and AI-powered coding assistance features such as code explanation, bug detection, optimization, complexity analysis, unit test generation, code conversion, and repository analysis.

## What is included

- JWT authentication and user profile endpoints
- File upload support for profile pictures
- AI service layer with a local fallback mode
- Google Gemini integration through the Google Generative AI REST API when configured
- Modular structure for future expansion into GitHub analysis, chat history, reports, and more

## Project structure

- app/main.py — FastAPI application entry point
- app/api/routes.py — auth and AI controller endpoints
- app/core/config.py — environment configuration
- app/db/database.py — PostgreSQL connector
- app/schemas/auth.py — auth request and response models
- app/schemas/ai.py — AI request and response models
- app/services/ai_service.py — AI orchestration service with Google-ready integration
- app/utils/auth.py — password hashing and JWT helpers
- init_db.py — database bootstrap for the users table
- tests/ — smoke and service tests

## API overview

Base URL: /api

### Authentication

- POST /api/register
- POST /api/login
- GET /api/me
- POST /api/upload-profile-picture

### AI endpoints

- POST /api/analyze-code
- POST /api/explain-code
- POST /api/optimize-code
- POST /api/complexity
- POST /api/generate-tests
- POST /api/convert-code
- POST /api/github/analyze

## Local setup

1. Create and activate a virtual environment

```bash
python -m venv .venv
.\.venv\Scripts\activate
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Create a .env file from the example

```bash
copy .env.example .env
```

4. Update the environment values

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/devlerner
SECRET_KEY=change-this-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=uploads/profile_pictures
AI_PROVIDER=local
GOOGLE_API_KEY=your-google-api-key
GOOGLE_MODEL=gemini-1.5-flash
```

5. Initialize the database

```bash
python init_db.py
```

6. Start the backend

```bash
python main.py
```

7. Open the API docs

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Google Cloud / Gemini setup

To enable real AI responses instead of the built-in fallback mode:

1. Create a Google Cloud project.
2. Enable the Google Generative AI API.
3. Create an API key.
4. Set AI_PROVIDER=google and GOOGLE_API_KEY in your .env file.

The backend is already prepared to call the Gemini REST endpoint using the configured model.

## Testing

Run tests with:

```bash
pytest
```

## Notes

- The service currently runs in local fallback mode by default.
- The AI layer is intentionally decoupled from the routes so you can replace it later with LangChain, Vertex AI, or another provider.
- The current implementation focuses on a solid backend foundation for DevMentor AI and can be extended with database-backed sessions, reports, chat history, and repository ingestion.
