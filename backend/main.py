from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app import models
from app.routes import router as integration_router

app = FastAPI(
    title="OAuth Navigator API",
    description="API for OAuth integration guides and AI-powered research",
    version="1.0.0"
)

# Register API routes
app.include_router(integration_router)

# Create database tables
Base.metadata.create_all(bind=engine)
# Allow communication from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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