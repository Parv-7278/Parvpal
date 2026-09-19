import logging
from typing import List, Optional
from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, Field

from services.energy_ml_service import EnergyPredictiveMLService
from services.ai_analyst_service import AIAnalystService
from services.station_service import StationService

logger = logging.getLogger("polaris.routers.energy_ai")

router = APIRouter(prefix="/api/ai", tags=["Energy AI Predictive Model"])

class EnergyPredictionRequest(BaseModel):
    station_id: str = Field(default="maitri", description="Station ID ('maitri', 'bharati', 'station-maitri', 'station-bharati')")
    prediction_hours: List[int] = Field(default=[1, 6, 24], description="Prediction horizons in hours")

class PredictionValues(BaseModel):
    battery_1h: float
    battery_6h: float
    battery_24h: float
    power_1h: float
    power_6h: float
    power_24h: float
    generator_temp_1h: Optional[float] = None
    generator_temp_6h: Optional[float] = None
    generator_temp_24h: Optional[float] = None

class EnergyPredictionResponse(BaseModel):
    station_id: str
    station_name: str
    model: str
    data_points_used: int
    prediction: PredictionValues
    generator_risk: str
    energy_risk: str
    confidence: float
    demand_trend: Optional[str] = None
    battery_trend: Optional[str] = None
    recommendation: str

@router.post(
    "/energy-prediction",
    response_model=EnergyPredictionResponse,
    summary="Data-Driven Predictive Energy Forecasting",
    description=(
        "Retrieves historical telemetry from Supabase, extracts features, trains/runs lightweight "
        "explainable ML regressors (Random Forest / Linear Regression), and forecasts battery reserve, "
        "power demand, and generator temperature at 1h, 6h, and 24h horizons with risk classification."
    )
)
async def predict_energy_conditions(
    payload: EnergyPredictionRequest,
    x_user_role: Optional[str] = Header(default="india_operator", alias="x-user-role"),
    x_station_id: Optional[str] = Header(default=None, alias="x-station-id")
):
    # 1. Normalize and validate station ID
    norm_st = StationService.normalize_station_id(payload.station_id)
    clean_id = "maitri" if "maitri" in norm_st else "bharati"

    # 2. RBAC: Verify station permissions
    is_authorized = AIAnalystService.validate_station_access(
        user_role=x_user_role,
        user_station=x_station_id,
        requested_station=norm_st
    )

    if not is_authorized:
        logger.warning(
            f"[Security] Station authorization denied for energy prediction. Role: {x_user_role}, "
            f"Assigned: {x_station_id}, Requested: {norm_st}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"Access Denied: Operators assigned to '{x_station_id}' are restricted from "
                f"accessing energy predictions for '{clean_id.upper()}'. Please switch to National Command clearance."
            )
        )

    # 3. Execute data pipeline & ML inference
    try:
        result = await EnergyPredictiveMLService.run_predictive_pipeline(
            station_id=clean_id,
            prediction_hours=payload.prediction_hours or [1, 6, 24]
        )
        return result
    except Exception as e:
        logger.error(f"[EnergyPrediction] Error running ML pipeline: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Predictive energy ML model processing error: {str(e)}"
        )
