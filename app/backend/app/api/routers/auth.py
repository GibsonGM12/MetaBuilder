from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.dto.auth_dto import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.application.services.auth_service import AuthService
from app.core.database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


async def _get_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(db)


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: RegisterRequest, service: AuthService = Depends(_get_service)):
    result = await service.register(data)
    return result


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, service: AuthService = Depends(_get_service)):
    result = await service.login(data)
    return result
