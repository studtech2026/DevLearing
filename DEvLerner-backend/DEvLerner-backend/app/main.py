from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="DevLerner Auth Backend")
app.include_router(router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok"}
