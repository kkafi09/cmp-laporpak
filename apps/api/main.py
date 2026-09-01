from contextlib import asynccontextmanager
import os
from sqlalchemy import text
from app.db.database import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_db
from app.api.v1.endpoints import router as api_v1_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="LaporPak! Agentic Intelligence Layer API",
    description="Backend Intelligence Middleware for Public Complaint Management (SP4N-LAPOR! Reference Case)",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        database_status = "healthy"
    except Exception:
        database_status = "unhealthy"
    return {
        "status": "healthy" if database_status == "healthy" else "degraded",
        "database": database_status,
        "service": "LaporPak! AI Intelligence Layer",
        "version": "1.0.0",
        "human_in_the_loop": True
    }
