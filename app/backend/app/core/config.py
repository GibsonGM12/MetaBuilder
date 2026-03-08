from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://metabuilder:metabuilder123@db:5432/metabuilder"
    DATABASE_URL_SYNC: str = "postgresql://metabuilder:metabuilder123@db:5432/metabuilder"

    JWT_SECRET_KEY: str = "super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 30

    DEBUG: bool = True

    APP_NAME: str = "MetaBuilder"
    APP_VERSION: str = "0.1.0"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
