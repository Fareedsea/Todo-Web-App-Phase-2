"""
FastAPI application entry point for Backend REST API.

Initializes FastAPI app, registers middleware, exception handlers, and API routes.
Database tables are created automatically on startup.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from .config import settings
from .database import create_db_and_tables
from .errors import register_exception_handlers
from .routes import auth_router, tasks_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# Create FastAPI application
app = FastAPI(
    title="Todo Backend API",
    description="Secure REST API for Phase II Todo Application with JWT authentication and user data isolation",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc documentation
)


# CORS Middleware Configuration
# SECURITY: Explicit origin allow-list (no wildcards)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,  # Production/development frontend
        "http://localhost:3000",  # Local development fallback
    ],
    allow_credentials=True,  # Required for Authorization header
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Explicit method list
    allow_headers=["Authorization", "Content-Type"],  # Explicit header list
)


# Register custom exception handlers
register_exception_handlers(app)


# Register API routers
# All routes automatically prefixed with /api/
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["Tasks"])


# Application Lifecycle Events

@app.on_event("startup")
async def on_startup():
    """
    Application startup event handler.

    Creates database tables if they don't exist.
    Logs startup configuration (sanitized).
    """
    logger.info("Starting Backend REST API...")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Frontend URL: {settings.frontend_url}")

    # Create database tables (idempotent)
    try:
        create_db_and_tables()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}", exc_info=True)
        raise

    logger.info("Backend REST API started successfully")


@app.on_event("shutdown")
async def on_shutdown():
    """
    Application shutdown event handler.

    Logs shutdown event for monitoring.
    """
    logger.info("Shutting down Backend REST API...")


# Health Check Endpoint

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.

    Returns 200 OK with basic status information.
    """
    return {
        "status": "healthy",
        "environment": settings.environment,
        "version": "1.0.0"
    }


# Root Endpoint

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint providing API information and documentation links.
    """
    return {
        "message": "Todo Backend REST API",
        "version": "1.0.0",
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        },
        "endpoints": {
            "authentication": "/api/auth",
            "tasks": "/api/tasks"
        }
    }
