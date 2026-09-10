from typing import List, Optional
from fastapi import APIRouter, HTTPException, Path, Query, status
from models.schemas import (
    StationMetadata,
    StationHealthResponse,
    StationModulesResponse,
    EnergyFlowResponse,
    LogisticsResponse,
    EnvironmentTelemetryResponse
)
from services.station_service import StationService, RAW_STATIONS_DATA

router = APIRouter(prefix="/api/stations", tags=["Research Stations"])

@router.get(
    "",
    response_model=List[StationMetadata],
    summary="List all Indian Antarctic Research Stations",
    description="Returns metadata for Maitri and Bharati research stations."
)
async def list_stations():
    return StationService.get_all_stations()

@router.get(
    "/{id}/health",
    response_model=StationHealthResponse,
    summary="Fetch Station Health Index and Subsystem Scores",
    description="Returns aggregate health score (0-100), rating, and breakdown for infrastructure, energy, logistics, environment, and comms."
)
async def get_station_health(
    id: str = Path(..., description="Station ID e.g. 'station-maitri' or 'station-bharati'")
):
    norm_id = StationService.normalize_station_id(id)
    if norm_id not in RAW_STATIONS_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station '{id}' not recognized. Valid options: 'station-maitri', 'station-bharati'."
        )
    return StationService.get_health_index(norm_id)

@router.get(
    "/{id}/modules",
    response_model=StationModulesResponse,
    summary="Fetch 3D Digital Twin Pins and Infrastructure Building Catalog",
    description="Returns coordinates, live temperature, power draw, subsystem status, and maintenance logs for 3D model pins and building blocks."
)
async def get_station_modules(
    id: str = Path(..., description="Station ID e.g. 'station-maitri' or 'station-bharati'")
):
    norm_id = StationService.normalize_station_id(id)
    if norm_id not in RAW_STATIONS_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station '{id}' not recognized. Valid options: 'station-maitri', 'station-bharati'."
        )
    return StationService.get_3d_modules(norm_id)

@router.get(
    "/{id}/energy",
    response_model=EnergyFlowResponse,
    summary="Fetch Energy Flow Metrics & Subsystem Generation Breakdown",
    description="Returns real-time power generation (kW), consumption (kW), surplus, battery BESS charge state, fuel reserves (L & days), and generator runtimes."
)
async def get_station_energy(
    id: str = Path(..., description="Station ID e.g. 'station-maitri' or 'station-bharati'")
):
    norm_id = StationService.normalize_station_id(id)
    if norm_id not in RAW_STATIONS_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station '{id}' not recognized. Valid options: 'station-maitri', 'station-bharati'."
        )
    return StationService.get_energy_flow(norm_id)

@router.get(
    "/{id}/logistics",
    response_model=LogisticsResponse,
    summary="Fetch Critical Logistics Inventory & Projected Depletion Curves",
    description="Returns stock levels for Arctic diesel, rations, emergency medicine, spare parts, and 30-day depletion projections."
)
async def get_station_logistics(
    id: str = Path(..., description="Station ID e.g. 'station-maitri' or 'station-bharati'")
):
    norm_id = StationService.normalize_station_id(id)
    if norm_id not in RAW_STATIONS_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station '{id}' not recognized. Valid options: 'station-maitri', 'station-bharati'."
        )
    return StationService.get_logistics_inventory(norm_id)

@router.get(
    "/{id}/environment",
    response_model=EnvironmentTelemetryResponse,
    summary="Fetch Polar Environmental Conditions & Sparklines",
    description="Returns ambient temperature, wind speed/direction, barometric pressure, snow accumulation, and SVG waveform paths."
)
async def get_station_environment(
    id: str = Path(..., description="Station ID e.g. 'station-maitri' or 'station-bharati'")
):
    norm_id = StationService.normalize_station_id(id)
    if norm_id not in RAW_STATIONS_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station '{id}' not recognized. Valid options: 'station-maitri', 'station-bharati'."
        )
    return StationService.get_environment_telemetry(norm_id)
