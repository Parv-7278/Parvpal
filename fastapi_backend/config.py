import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    APP_NAME: str = "POLARIS Antarctic Digital Twin Backend"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DEBUG: bool = True

    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://localhost:5000"

    SUPABASE_URL: str = "https://uajnemuotinotiyurdud.supabase.co"
    SUPABASE_KEY: str = "sb_publishable_Dz0Zq6o-F-LWelMdy5aOBQ_-wyb51xc"
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    WS_TICK_INTERVAL_SECONDS: float = 1.5
    SIMULATION_MAX_DAYS: int = 90

    # AI Research Analyst Provider Settings
    AI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    AI_MODEL: str = "gemini-1.5-flash"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origin_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()
