from fastapi import APIRouter, HTTPException, Path, status
from models.schemas import ResearchTelemetryResponse
from services.research_service import ResearchService
from services.station_service import StationService, RAW_STATIONS_DATA

router = APIRouter(prefix="/api/stations", tags=["Scientific Research Observatories"])

@router.get(
    "/{id}/research",
    response_model=ResearchTelemetryResponse,
    summary="Fetch Live Polar Scientific Research Telemetry",
    description=(
        "Returns dedicated Antarctic scientific research payloads including: "
        "1. Borehole Seismic Tremors (Dominant Frequency in Hz, Ground Acceleration in g) "
        "2. Ultrasonic Snowpack Accumulation & Firn Densification (cm, kg/m³) "
        "3. Tri-Axial Geomagnetic Kp Index (0-9 Storm Scale, Magnetic Intensity in nT, S4 Scintillation) "
        "4. Overwintering Expedition Crew Bio-Telemetry (Heart Rate, SpO2, Stress Index, Thermal Comfort)"
    )
)
async def get_station_research_data(
    id: str = Path(..., description="Station ID e.g. 'station-maitri' or 'station-bharati'")
):
    norm_id = StationService.normalize_station_id(id)
    if norm_id not in RAW_STATIONS_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station '{id}' not recognized. Valid options: 'station-maitri', 'station-bharati'."
        )
    return ResearchService.get_research_telemetry(norm_id)
