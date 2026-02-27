from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import HTTPException, status
from jose import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.dto.auth_dto import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.core.config import settings
from app.infrastructure.database.models import UserModel


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


class AuthService:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def register(self, data: RegisterRequest) -> UserResponse:
        stmt = select(UserModel).where(UserModel.username == data.username)
        result = await self._session.execute(stmt)
        if result.scalar_one_or_none():
            raise HTTPException(status.HTTP_409_CONFLICT, "El usuario ya existe")

        user = UserModel(
            username=data.username,
            email=data.email,
            password_hash=hash_password(data.password),
            role=data.role,
        )
        self._session.add(user)
        await self._session.flush()
        await self._session.refresh(user)
        return UserResponse.model_validate(user)

    async def login(self, data: LoginRequest) -> TokenResponse:
        stmt = select(UserModel).where(UserModel.username == data.username)
        result = await self._session.execute(stmt)
        user = result.scalar_one_or_none()

        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciales inválidas")

        token = self._create_token(str(user.id), user.role)
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user),
        )

    @staticmethod
    def _create_token(user_id: str, role: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
        payload = {"sub": user_id, "role": role, "exp": expire}
        return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
