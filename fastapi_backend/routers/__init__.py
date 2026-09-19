from .stations import router as stations_router
from .research import router as research_router
from .simulations import router as simulations_router
from .websocket import router as websocket_router
from .telemetry import router as telemetry_router
from .alerts import router as alerts_router
from .ai_analyst import router as ai_analyst_router
from .energy_ai import router as energy_ai_router
from .predictive_ml import router as predictive_ml_router
from .predictions import router as predictions_router

__all__ = [
    "stations_router",
    "research_router",
    "simulations_router",
    "websocket_router",
    "telemetry_router",
    "alerts_router",
    "ai_analyst_router",
    "energy_ai_router",
    "predictive_ml_router",
    "predictions_router",
]
