from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class RecordCreate(BaseModel):
    data: dict[str, Any]


class RecordUpdate(BaseModel):
    data: dict[str, Any]


class RecordResponse(BaseModel):
    id: UUID
    created_at: datetime
    data: dict[str, Any]


class PaginatedResponse(BaseModel):
    items: list[RecordResponse]
    total: int
    page: int = Field(ge=1)
    page_size: int = Field(ge=1, le=100)
    total_pages: int
