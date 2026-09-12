import logging
from typing import Optional
from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, Field

from services.ai_analyst_service import AIAnalystService

logger = logging.getLogger("polaris.routers.ai_analyst")

router = APIRouter(prefix="/api/research/ai-analyst", tags=["AI Research Analyst"])

class AnalysisRequest(BaseModel):
    station_id: str = Field(default="station-maitri", description="Station ID ('station-maitri', 'station-bharati', 'all-stations')")
    analysis_type: str = Field(default="summary", description="Analysis type: 'trends', 'anomalies', 'correlations', 'summary', 'compare', 'forecast', 'energy_env', 'risk'")
    time_range: str = Field(default="7d", description="Time window: '24h', '7d', '30d'")
    user_query: Optional[str] = Field(default=None, description="Optional custom natural language research query")

class AskQueryRequest(BaseModel):
    station_id: str = Field(default="station-maitri", description="Station ID")
    question: str = Field(..., description="User question e.g. 'What changed in Maitri over the last 7 days?'")
    time_range: str = Field(default="7d", description="Time window: '24h', '7d', '30d'")

@router.get("/status", summary="AI Research Analyst Engine Status")
async def get_ai_analyst_status():
    """Returns AI Research Analyst operational status and system health."""
    return {
        "status": "ONLINE",
        "badge": "AI ANALYSIS READY",
        "engine": "POLARIS Hybrid Python Analytics + AI Synthesis",
        "supported_time_ranges": ["24h", "7d", "30d"],
        "supported_analysis_types": [
            "trends",
            "anomalies",
            "correlations",
            "summary",
            "compare",
            "forecast",
            "energy_env",
            "risk"
        ],
        "station_security_enforced": True
    }

@router.post("/analyze", summary="Run Comprehensive AI Research Analysis")
async def analyze_research_data(
    payload: AnalysisRequest,
    x_user_role: Optional[str] = Header(default="india_operator", alias="x-user-role"),
    x_station_id: Optional[str] = Header(default=None, alias="x-station-id")
):
    """
    Analyzes historical and current research/telemetry data from Supabase PostgreSQL.
    Enforces station-level role-based authorization (HTTP 403 on permission breach).
    """
    # Authorization Guard
    is_authorized = AIAnalystService.validate_station_access(
        user_role=x_user_role,
        user_station=x_station_id,
        requested_station=payload.station_id
    )

    if not is_authorized:
        logger.warning(
            f"[Security] Unauthorized AI analysis attempt. Role: {x_user_role}, "
            f"Assigned Station: {x_station_id}, Requested: {payload.station_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"Access Denied: Station operators assigned to '{x_station_id}' are restricted from "
                f"accessing research intelligence for '{payload.station_id}'. Please switch to India Command Centre."
            )
        )

    try:
        result = await AIAnalystService.run_full_analysis(
            station_id=payload.station_id,
            analysis_type=payload.analysis_type,
            time_range=payload.time_range,
            user_query=payload.user_query
        )
        return result
    except Exception as e:
        logger.error(f"[AI Analyst] Error processing analysis: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Research Analyst processing error: {str(e)}"
        )

@router.post("/ask", summary="Ask Research AI Free-Form Query")
async def ask_research_ai(
    payload: AskQueryRequest,
    x_user_role: Optional[str] = Header(default="india_operator", alias="x-user-role"),
    x_station_id: Optional[str] = Header(default=None, alias="x-station-id")
):
    """
    Processes natural language inquiries against filtered database telemetry.
    """
    # Authorization Guard
    is_authorized = AIAnalystService.validate_station_access(
        user_role=x_user_role,
        user_station=x_station_id,
        requested_station=payload.station_id
    )

    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access Denied: Operator not authorized to query '{payload.station_id}'."
        )

    try:
        # Determine intent
        q_lower = payload.question.lower()
        analysis_type = "summary"
        if "compare" in q_lower or "vs" in q_lower:
            analysis_type = "compare"
        elif "anomal" in q_lower or "unusual" in q_lower:
            analysis_type = "anomalies"
        elif "trend" in q_lower or "change" in q_lower:
            analysis_type = "trends"
        elif "predict" in q_lower or "forecast" in q_lower or "future" in q_lower:
            analysis_type = "forecast"
        elif "correlat" in q_lower or "relation" in q_lower:
            analysis_type = "correlations"

        result = await AIAnalystService.run_full_analysis(
            station_id=payload.station_id,
            analysis_type=analysis_type,
            time_range=payload.time_range,
            user_query=payload.question
        )
        if isinstance(result, dict) and "answer" not in result:
            result["answer"] = result.get("summary", "")
        return result
    except Exception as e:
        logger.error(f"[AI Analyst] Error answering question: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing AI research question: {str(e)}"
        )
