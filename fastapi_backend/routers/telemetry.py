import logging
import random
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, status
from models.schemas import TelemetryIngestPayload
from services.station_service import StationService, RAW_STATIONS_DATA
from routers.websocket import manager

logger = logging.getLogger("polaris.telemetry")
router = APIRouter(prefix="/api", tags=["Telemetry Stream & Simulator Ingestion"])

@router.post(
    "/telemetry",
    summary="Ingest Python Simulator Telemetry",
    description="Receives real-time telemetry from Python station simulator, updates station state, checks thresholds, and broadcasts over WebSocket."
)
async def ingest_telemetry(payload: TelemetryIngestPayload):
    norm_id = StationService.normalize_station_id(payload.station_id)
    if norm_id not in RAW_STATIONS_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station '{payload.station_id}' not recognized. Valid options: 'station-maitri', 'station-bharati'."
        )

    # Update in-memory & database station telemetry
    updated_state = StationService.update_station_telemetry(payload)
    
    # Detailed logging required by specification
    st_name = "maitri" if "maitri" in norm_id else "bharati"
    gen_temp = payload.generator_temperature
    batt = payload.battery_level or payload.battery or 74.0
    status_label = updated_state.get("generator_status", "RUNNING")
    
    logger.info(f"[TELEMETRY] station={st_name} generator_temperature={gen_temp}°C battery={batt}% status={status_label}")

    # Broadcast live packet over WebSocket to React frontend
    broadcast_packet = {
        "packet_id": f"pkt-{int(datetime.utcnow().timestamp() * 1000)}",
        "station_id": norm_id,
        "station_name": "Maitri" if "maitri" in norm_id else "Bharati",
        "timestamp": datetime.utcnow().isoformat(),
        "time_label": datetime.utcnow().strftime("%H:%M:%S"),
        "power_generation_kw": RAW_STATIONS_DATA[norm_id]["energy"]["generation"],
        "power_consumption_kw": round(payload.power_consumption, 1),
        "battery_level_percent": round(batt, 1),
        "ambient_temperature_c": round(payload.temperature, 1),
        "wind_speed_kmh": round(payload.wind_speed, 1),
        "generator_core_temp_c": round(payload.generator_temperature, 1),
        "seismic_frequency_hz": 1.85 if "maitri" in norm_id else 3.65,
        "geomagnetic_kp_index": 2.4 if "maitri" in norm_id else 2.8,
        "comms_latency_ms": random.randint(235, 265),
        "system_status": status_label,
        "data": updated_state
    }
    await manager.broadcast_json(broadcast_packet)

    return {
        "success": True,
        "station_id": norm_id,
        "status": status_label,
        "received_at": datetime.utcnow().isoformat(),
        "data": updated_state
    }

@router.post(
    "/sensor-data/latest",
    summary="Ingest Sensor Data (Alias)",
    description="Alias endpoint for sensor data ingestion."
)
async def ingest_sensor_data_alias(payload: TelemetryIngestPayload):
    return await ingest_telemetry(payload)

@router.get(
    "/sensor-data/latest",
    summary="Fetch Latest Telemetry for Station",
    description="Returns the most recent telemetry readings for the requested station or all stations."
)
async def get_latest_sensor_data(stationId: Optional[str] = Query(None, description="Optional station ID")):
    if not stationId or stationId == "all" or stationId == "all-stations":
        maitri = StationService.get_raw_station_data("station-maitri")
        bharati = StationService.get_raw_station_data("station-bharati")
        return {
            "success": True,
            "data": {
                "station-maitri": {
                    "station_id": "station-maitri",
                    "station_name": "MAITRI",
                    "temperature": float(maitri["weather"]["temp"]),
                    "wind_speed": float(maitri["weather"]["windSpeed"].split()[0]),
                    "battery": maitri["energy"]["batteryPercent"],
                    "battery_level": maitri["energy"]["batteryPercent"],
                    "power_consumption": maitri["energy"]["consumption"],
                    "generator_temperature": 78.4,
                    "generator_status": "RUNNING",
                    "water_level": 88.0,
                    "comms_status": "SAT_LINK_NOMINAL"
                },
                "station-bharati": {
                    "station_id": "station-bharati",
                    "station_name": "BHARATI",
                    "temperature": float(bharati["weather"]["temp"]),
                    "wind_speed": float(bharati["weather"]["windSpeed"].split()[0]),
                    "battery": bharati["energy"]["batteryPercent"],
                    "battery_level": bharati["energy"]["batteryPercent"],
                    "power_consumption": bharati["energy"]["consumption"],
                    "generator_temperature": 74.1,
                    "generator_status": "RUNNING",
                    "water_level": 94.0,
                    "comms_status": "SAT_LINK_NOMINAL"
                }
            }
        }
    
    norm_id = StationService.normalize_station_id(stationId)
    st_data = StationService.get_raw_station_data(norm_id)
    return {
        "success": True,
        "data": {
            norm_id: {
                "station_id": norm_id,
                "station_name": st_data["name"],
                "temperature": float(st_data["weather"]["temp"]),
                "wind_speed": float(st_data["weather"]["windSpeed"].split()[0]),
                "battery": st_data["energy"]["batteryPercent"],
                "battery_level": st_data["energy"]["batteryPercent"],
                "power_consumption": st_data["energy"]["consumption"],
                "generator_temperature": 78.4 if "maitri" in norm_id else 74.1,
                "generator_status": "RUNNING",
                "water_level": 88.0 if "maitri" in norm_id else 94.0,
                "comms_status": "SAT_LINK_NOMINAL"
            }
        }
    }

@router.get(
    "/telemetry/queue-metrics",
    summary="Fetch Satellite Link Priority Queue Metrics",
    description="Returns simulated latency and priority packet queue diagnostics."
)
async def get_queue_metrics():
    return {
        "success": True,
        "data": {
            "label": "ISRO GSAT-30 Ku-Band Polar Link",
            "queueSnapshot": {
                "count": random.randint(2, 6),
                "criticalCount": 0,
                "highCount": 1,
                "normalCount": random.randint(1, 4),
                "lowCount": 1,
                "items": []
            },
            "recentLogs": [
                {"timestamp": datetime.utcnow().strftime("%H:%M:%S"), "text": "Telemetry frame sync nominal via GSAT-30."},
                {"timestamp": datetime.utcnow().strftime("%H:%M:%S"), "text": "Doppler frequency tracking within ±25 Hz."}
            ],
            "summary": {
                "totalProcessed": random.randint(14200, 18900),
                "critical": {"count": 1, "avgQueueDelayMs": 12, "avgTotalLatencyMs": 240},
                "high": {"count": 8, "avgQueueDelayMs": 28, "avgTotalLatencyMs": 255},
                "normal": {"count": 340, "avgQueueDelayMs": 45, "avgTotalLatencyMs": 270},
                "low": {"count": 110, "avgQueueDelayMs": 95, "avgTotalLatencyMs": 320}
            }
        }
    }
