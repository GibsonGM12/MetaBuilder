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
    field_type: str = Field(..., pattern="^(TEXT|NUMBER|INTEGER|DATE|BOOLEAN|RELATION)$")
    is_required: bool = False
    max_length: int | None = Field(None, ge=1, le=10000)
    target_entity_id: UUID | None = None
    target_display_field: str | None = None


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


class RelationshipResponse(BaseModel):
    id: UUID
    source_entity_id: UUID
    target_entity_id: UUID
    relationship_type: str
    source_field_id: UUID
    target_display_field: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LookupItem(BaseModel):
    id: UUID
    display_value: str
