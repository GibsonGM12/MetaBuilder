from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/api/v1/version")
async def version():
    return {"version": settings.APP_VERSION, "name": settings.APP_NAME}
