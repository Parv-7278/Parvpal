import os
import sys
import logging
from datetime import datetime
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from config import settings

from services.supabase_client import get_supabase_client, is_supabase_configured
from routers import (
    stations_router, 
    research_router, 
    simulations_router, 
    websocket_router,
    telemetry_router,
    alerts_router,
    ai_analyst_router,
    energy_ai_router,
    predictive_ml_router,
    predictions_router
)

# Configure Logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("polaris.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Sequence
    logger.info("==================================================================")
    logger.info(f"❄️  {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"🌐 Environment: {settings.ENVIRONMENT} | Port: {settings.PORT}")
    logger.info(f"🛡️  Allowed CORS Origins: {settings.cors_origin_list}")
    
    # Initialize Supabase Client
    sb_client = get_supabase_client()
    if sb_client:
        logger.info("🛰️  Supabase PostgreSQL Gateway: ACTIVE")
    else:
        logger.info("🛰️  Supabase Gateway: IN-MEMORY SIMULATED FALLBACK")
        
    logger.info("🚀 POLARIS Antarctic Mission Control API Ready.")
    logger.info("==================================================================")
    
    yield
    
    # Shutdown Sequence
    logger.info("🛑 POLARIS API Gateway shutting down safely.")

# Initialize FastAPI App
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Production-ready FastAPI backend for the POLARIS Antarctic Digital Twin platform. "
        "Provides real-time telemetry, 3D building statuses, energy grid flows, logistics inventory, "
        "dedicated scientific research observatories (seismic, geomagnetic Kp, snow accumulation, crew vitals), "
        "What-If failure simulation engine, and live WebSocket streaming for India's Maitri and Bharati research stations."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list if settings.cors_origin_list else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global Request Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"[ValidationError] Route: {request.method} {request.url.path} - Details: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error_type": "VALIDATION_ERROR",
            "message": "Incoming payload failed Pydantic schema validation.",
            "details": exc.errors()
        }
    )

# Global Unexpected Error Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"[InternalError] Unhandled error at {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error_type": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected server error occurred in Antarctic backend.",
            "detail": str(exc) if settings.DEBUG else "Please check server logs."
        }
    )

# Health Check & Root Discovery Endpoints
@app.get("/api/health", tags=["System Diagnostics"])
async def health_check():
    return {
        "status": "ONLINE",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "supabase_connected": is_supabase_configured(),
        "stations_monitored": ["Maitri (Schirmacher Oasis)", "Bharati (Larsemann Hills)"],
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/", tags=["System Diagnostics"])
async def root_index():
    return {
        "title": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "documentation": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "health": "/api/health",
            "stations_list": "/api/stations",
            "station_health": "/api/stations/{id}/health",
            "station_3d_modules": "/api/stations/{id}/modules",
            "station_energy": "/api/stations/{id}/energy",
            "station_logistics": "/api/stations/{id}/logistics",
            "station_environment": "/api/stations/{id}/environment",
            "station_research": "/api/stations/{id}/research",
            "energy_ai_prediction": "/api/ai/energy-prediction",
            "predictive_ml_predict": "/api/ml/predict",
            "predictive_ml_train": "/api/ml/train",
            "predictive_ml_status": "/api/ml/status",
            "simulations_run": "/api/simulations/run",
            "simulations_scenarios": "/api/simulations/scenarios",
            "websocket_telemetry": "/ws/telemetry"
        }
    }

# Register Routers
app.include_router(stations_router)
app.include_router(research_router)
app.include_router(simulations_router)
app.include_router(websocket_router)
app.include_router(telemetry_router)
app.include_router(alerts_router)
app.include_router(ai_analyst_router)
app.include_router(energy_ai_router)
app.include_router(predictive_ml_router)
app.include_router(predictions_router)

# Standalone Execution Entrypoint
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
