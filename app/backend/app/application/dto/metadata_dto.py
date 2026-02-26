from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class EntityCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    display_name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None


class EntityUpdate(BaseModel):
    display_name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None


class FieldCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    display_name: str = Field(..., min_length=1, max_length=200)
    field_type: str = Field(..., pattern="^(TEXT|NUMBER|INTEGER|DATE|BOOLEAN)$")
    is_required: bool = False
    max_length: int | None = Field(None, ge=1, le=10000)


class FieldResponse(BaseModel):
    id: UUID
    entity_id: UUID
    name: str
    display_name: str
    field_type: str
    is_required: bool
    max_length: int | None
    column_name: str
    display_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class EntityResponse(BaseModel):
    id: UUID
    name: str
    display_name: str
    description: str | None
    table_name: str
    created_at: datetime
    fields: list[FieldResponse] = []

    model_config = {"from_attributes": True}


class EntityListResponse(BaseModel):
    id: UUID
    name: str
    display_name: str
    description: str | None
    table_name: str
    created_at: datetime

    model_config = {"from_attributes": True}
