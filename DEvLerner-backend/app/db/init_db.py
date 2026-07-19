import psycopg2
from app.core.config import settings


def init_db() -> None:
    with psycopg2.connect(settings.database_url) as conn:
        with conn.cursor() as cur:
            cur.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                username VARCHAR(100) UNIQUE,
                phone VARCHAR(50),
                gender VARCHAR(20),
                date_of_birth DATE,
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(100),
                country VARCHAR(100),
                bio TEXT,
                profile_picture VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
            ''')
            conn.commit()


if __name__ == "__main__":
    init_db()
    print("Database initialized")
