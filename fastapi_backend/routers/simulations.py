from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from models.schemas import SimulationRequest, SimulationResponse, ScenarioTypeEnum
from services.simulation_engine import SimulationEngine

router = APIRouter(prefix="/api/simulations", tags=["What-If Simulation Engine"])

@router.get(
    "/scenarios",
    response_model=List[Dict[str, Any]],
    summary="List available failure and weather stress scenarios",
    description="Returns preconfigured operational stress scenarios for Indian Antarctic research stations."
)
async def list_available_scenarios():
    return [
        {
            "id": ScenarioTypeEnum.GENERATOR_FAILURE.value,
            "label": "Generator Thermal Runaway / Sudden Trip",
            "applicable_stations": ["station-maitri", "station-bharati"],
            "severity": "HIGH",
            "description": "Simulates sudden loss of primary generator output requiring immediate grid transfer."
        },
        {
            "id": ScenarioTypeEnum.BLIZZARD_KATABATIC.value,
            "label": "Schirmacher / Prydz Bay Katabatic Blizzard (-35°C, 95 km/h)",
            "applicable_stations": ["station-maitri", "station-bharati"],
            "severity": "CRITICAL",
            "description": "Simulates extreme thermal heating demand surge and structural gale load."
        },
        {
            "id": ScenarioTypeEnum.LAKE_INTAKE_FREEZE.value,
            "label": "Lake Priyadarshini Sub-Surface Water Line Freeze",
            "applicable_stations": ["station-maitri"],
            "severity": "MEDIUM",
            "description": "Simulates freeze-up of freshwater intake pipeline and melt skid auxiliary heater demand."
        },
        {
            "id": ScenarioTypeEnum.FUEL_CONVOY_DELAY.value,
            "label": "Overland Resupply Convoy 3-Week Storm Delay",
            "applicable_stations": ["station-maitri", "station-bharati"],
            "severity": "LOW",
            "description": "Simulates delayed logistics arrival triggering Stage-1 fuel conservation protocol."
        },
        {
            "id": ScenarioTypeEnum.RADOME_ICING.value,
            "label": "Coastal Mist Radome Riming & De-icing Load",
            "applicable_stations": ["station-bharati"],
            "severity": "HIGH",
            "description": "Simulates heavy riming on Earth Observation radome during satellite telemetry window."
        },
        {
            "id": ScenarioTypeEnum.SEAWATER_DESAL_ICE.value,
            "label": "Sub-Sea Seawater Intake Frazil Ice Blockage",
            "applicable_stations": ["station-bharati"],
            "severity": "MEDIUM",
            "description": "Simulates sub-sea reverse osmosis marine intake freeze and indoor reserve tank usage."
        },
        {
            "id": ScenarioTypeEnum.SOLAR_BLACKOUT.value,
            "label": "Polar Night Complete Solar Absence (Winter-Over)",
            "applicable_stations": ["station-maitri", "station-bharati"],
            "severity": "MODERATE",
            "description": "Simulates 100% reliance on thermal CHP and diesel generator baseload."
        }
    ]

@router.post(
    "/run",
    response_model=SimulationResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute What-If Dynamic Polar Operational Simulation",
    description=(
        "Calculates dynamic power drops, battery reserves, load shedding actions, and mission risk factors "
        "based on selected failure parameters and weather stress modifiers."
    )
)
async def run_simulation(request: SimulationRequest):
    try:
        return SimulationEngine.run_simulation(request)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation computation engine failure: {str(err)}"
        )
