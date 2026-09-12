import asyncio
import json
import logging
import math
import random
import time
from datetime import datetime
from typing import List, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from config import settings
from models.schemas import WebSocketTickerPayload

logger = logging.getLogger("polaris.websocket")
router = APIRouter(tags=["Real-Time Telemetry Stream"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"[WebSocket] Client connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        logger.info(f"[WebSocket] Client disconnected. Total active: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        dead_connections = []
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.warning(f"[WebSocket] Failed to send to client: {e}")
                dead_connections.append(connection)
        
        for dead in dead_connections:
            self.active_connections.discard(dead)

    async def broadcast_json(self, data: dict):
        msg = json.dumps(data)
        await self.broadcast(msg)

manager = ConnectionManager()

def generate_telemetry_tick(station_id: str = "station-maitri") -> WebSocketTickerPayload:
    now = datetime.utcnow()
    t_sec = time.time()
    is_maitri = "maitri" in station_id.lower()

    if is_maitri:
        base_gen = 132.0 + 4.5 * math.sin(t_sec / 10.0) + random.uniform(-1.5, 1.5)
        base_cons = 105.0 + 3.0 * math.cos(t_sec / 14.0) + random.uniform(-1.2, 1.2)
        batt = 74.0 + 0.4 * math.sin(t_sec / 30.0)
        temp = -18.7 + 0.6 * math.sin(t_sec / 20.0) + random.uniform(-0.1, 0.1)
        wind = 28.0 + 5.0 * math.sin(t_sec / 8.0) + random.uniform(-2.0, 2.0)
        gen_temp = 78.4 + 1.2 * math.cos(t_sec / 16.0)
        seis = 1.85 + 0.3 * math.sin(t_sec / 6.0)
        kp = 2.4 + 0.3 * math.cos(t_sec / 40.0)
        station_name = "Maitri"
    else:
        base_gen = 185.0 + 6.0 * math.sin(t_sec / 12.0) + random.uniform(-2.0, 2.0)
        base_cons = 148.0 + 4.0 * math.cos(t_sec / 15.0) + random.uniform(-1.5, 1.5)
        batt = 91.0 + 0.3 * math.cos(t_sec / 35.0)
        temp = -14.2 + 0.8 * math.sin(t_sec / 18.0) + random.uniform(-0.15, 0.15)
        wind = 44.0 + 8.0 * math.sin(t_sec / 7.0) + random.uniform(-3.0, 3.0)
        gen_temp = 74.1 + 0.8 * math.sin(t_sec / 14.0)
        seis = 3.65 + 0.6 * math.sin(t_sec / 5.0)
        kp = 2.8 + 0.4 * math.sin(t_sec / 30.0)
        station_name = "Bharati"

    pkt_id = f"pkt-{int(t_sec * 1000)}-{random.randint(100, 999)}"
    time_label = now.strftime("%H:%M:%S")

    return WebSocketTickerPayload(
        packet_id=pkt_id,
        station_id=station_id,
        station_name=station_name,
        timestamp=now.isoformat(),
        time_label=time_label,
        power_generation_kw=round(base_gen, 1),
        power_consumption_kw=round(base_cons, 1),
        battery_level_percent=round(batt, 1),
        ambient_temperature_c=round(temp, 1),
        wind_speed_kmh=round(wind, 1),
        generator_core_temp_c=round(gen_temp, 1),
        seismic_frequency_hz=round(seis, 2),
        geomagnetic_kp_index=round(kp, 2),
        comms_latency_ms=random.randint(235, 265),
        system_status="NOMINAL" if gen_temp < 85.0 else "WARNING"
    )

@router.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    active_station = "station-maitri"

    async def client_listener():
        nonlocal active_station
        try:
            while True:
                data = await websocket.receive_text()
                try:
                    msg = json.loads(data)
                    if msg.get("action") == "set_station" and msg.get("station_id"):
                        active_station = msg.get("station_id")
                        logger.info(f"[WebSocket] Switched station stream to: {active_station}")
                except json.JSONDecodeError:
                    pass
        except WebSocketDisconnect:
            pass
        except Exception:
            pass

    async def stream_ticker():
        try:
            while True:
                # Generate telemetry packet for Recharts live graph streaming
                payload = generate_telemetry_tick(active_station)
                await websocket.send_text(payload.model_dump_json())
                await asyncio.sleep(settings.WS_TICK_INTERVAL_SECONDS)
        except WebSocketDisconnect:
            logger.info("[WebSocket] Client disconnected from telemetry stream.")
        except Exception as err:
            logger.debug(f"[WebSocket] Stream closed: {err}")
        finally:
            manager.disconnect(websocket)

    listener_task = asyncio.create_task(client_listener())
    stream_task = asyncio.create_task(stream_ticker())

    done, pending = await asyncio.wait(
        [listener_task, stream_task],
        return_when=asyncio.FIRST_COMPLETED
    )

    for task in pending:
        task.cancel()
