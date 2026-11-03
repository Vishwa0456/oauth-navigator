import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app import models
from app.routes import router as integration_router

# Load environment variables
ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

app = FastAPI(
    title="OAuth Navigator API",
    description="API for OAuth integration guides and AI-powered research",
    version="1.0.0"
)

# Register API routes
app.include_router(integration_router)

# Create database tables
Base.metadata.create_all(bind=engine)

# Configure allowed frontend origins
frontend_urls = os.getenv(
    "FRONTEND_URLS",
    "http://localhost:5173"
)

allowed_origins = [
    url.strip()
    for url in frontend_urls.split(",")
    if url.strip()
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to OAuth Navigator API",
        "status": "Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "OAuth Navigator Backend"
    }
