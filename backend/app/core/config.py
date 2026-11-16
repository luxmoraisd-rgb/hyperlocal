import os


class Settings:
    """Environment-backed application settings."""

    @property
    def cors_origins(self) -> list[str]:
        origins = os.getenv(
            "API_CORS_ORIGINS",
            "http://localhost:5173,http://localhost:5174",
        )
        return [origin.strip() for origin in origins.split(",") if origin.strip()]


settings = Settings()
