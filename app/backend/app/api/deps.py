from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.auth_service import AuthService
from app.application.services.metadata_service import MetadataService
from app.core.config import settings
from app.core.database import get_db
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository
from app.infrastructure.database.table_manager import TableManager

security = HTTPBearer(auto_error=False)


async def get_metadata_service(db: AsyncSession = Depends(get_db)) -> MetadataService:
    repo = MetadataRepository(db)
    tm = TableManager(db)
    return MetadataService(repo, tm)


async def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(db)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> dict:
    if not credentials:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token no proporcionado")
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
        role = payload.get("role")
        if not user_id:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido")
        return {"user_id": UUID(user_id), "role": role}
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido o expirado")


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "Admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Se requieren permisos de administrador")
    return current_user
