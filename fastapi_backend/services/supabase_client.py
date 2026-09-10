import logging
from typing import Optional, Any, Dict, List
from config import settings

logger = logging.getLogger("polaris.supabase")

_supabase_client = None

def get_supabase_client():
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY or settings.SUPABASE_SERVICE_ROLE_KEY

    if url and key and "your-project" not in url:
        try:
            from supabase import create_client, Client
            _supabase_client = create_client(url, key)
            logger.info("[Supabase] Connected to Supabase PostgreSQL at %s", url)
            return _supabase_client
        except Exception as e:
            logger.warning("[Supabase] Failed to initialize Supabase client: %s. Using local memory fallback.", e)
            _supabase_client = None
            return None
    else:
        logger.info("[Supabase] Running in local in-memory simulated mode (No valid credentials provided).")
        return None

def is_supabase_configured() -> bool:
    return get_supabase_client() is not None

async def fetch_station_telemetry_db(station_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    client = get_supabase_client()
    if not client:
        return []
    try:
        response = client.table("telemetry_logs") \
            .select("*") \
            .eq("station_id", station_id) \
            .order("recorded_at", desc=True) \
            .limit(limit) \
            .execute()
        return response.data or []
    except Exception as err:
        logger.error("[Supabase] Query error for telemetry_logs: %s", err)
        return []

async def fetch_station_alerts_db(station_id: str, status: Optional[str] = "ACTIVE") -> List[Dict[str, Any]]:
    client = get_supabase_client()
    if not client:
        return []
    try:
        query = client.table("alerts").select("*").eq("station_id", station_id)
        if status:
            query = query.eq("status", status)
        response = query.order("triggered_at", desc=True).execute()
        return response.data or []
    except Exception as err:
        logger.error("[Supabase] Query error for alerts: %s", err)
        return []

async def insert_telemetry_log_db(payload: Dict[str, Any]) -> bool:
    client = get_supabase_client()
    if not client:
        return False
    try:
        response = client.table("telemetry_logs").insert([payload]).execute()
        return bool(response.data)
    except Exception as err:
        logger.error("[Supabase] Insert error for telemetry_logs: %s", err)
        return False
