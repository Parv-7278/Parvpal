import logging
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Path, Query, status
from models.schemas import AlertIngestPayload, AlertItem
from services.station_service import StationService
from routers.websocket import manager

logger = logging.getLogger("polaris.alerts")
router = APIRouter(prefix="/api/alerts", tags=["Mission Critical Alerts & Incident Logs"])

@router.get(
    "",
    summary="List Active Monitored Incidents and Alerts",
    description="Returns filtered alerts for a specific station or unified national list."
)
async def get_alerts(
    stationId: Optional[str] = Query(None, description="Optional station ID e.g. 'station-maitri' or 'station-bharati'")
):
    alerts = StationService.get_alerts(stationId)
    return {
        "success": True,
        "count": len(alerts),
        "data": alerts
    }

@router.post(
    "",
    summary="Ingest Alert from Simulator or Subsystem",
    description="Adds a new emergency/operational alert, checks priority level, and broadcasts to WebSocket."
)
async def create_alert(payload: AlertIngestPayload):
    new_alert = StationService.add_alert(payload.model_dump())
    logger.warning(f"[ALERT INGESTED] priority={new_alert['priority']} station={new_alert['station_id']} msg={new_alert['message']}")

    # Broadcast emergency alert packet over WebSocket
    await manager.broadcast_json({
        "packet_type": "EMERGENCY_ALERT",
        "station_id": new_alert["station_id"],
        "priority": new_alert["priority"],
        "data": new_alert,
        "timestamp": datetime.utcnow().isoformat()
    })

    return {
        "success": True,
        "alert": new_alert
    }

@router.patch(
    "/{alert_id}/ack",
    summary="Acknowledge Monitored Incident",
    description="Marks an alert as acknowledged by mission controller."
)
async def acknowledge_alert(
    alert_id: str = Path(..., description="Alert ID")
):
    acked = StationService.ack_alert(alert_id)
    if not acked:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert with ID '{alert_id}' not found."
        )
    return {
        "success": True,
        "message": f"Alert '{alert_id}' acknowledged.",
        "alert": acked
    }

@router.delete(
    "/clear",
    summary="Clear Resolved Alerts",
    description="Clears all or station-specific resolved alerts."
)
async def clear_alerts(
    stationId: Optional[str] = Query(None, description="Optional station ID to clear")
):
    StationService.clear_alerts(stationId)
    return {
        "success": True,
        "message": "Alerts cleared."
    }
