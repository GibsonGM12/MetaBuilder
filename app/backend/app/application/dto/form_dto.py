from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


VALID_SECTION_TYPES = {"FIELDS", "LOOKUP", "DETAIL_TABLE", "CALCULATED"}


class SectionFieldCreate(BaseModel):
    entity_field_id: UUID | None = None
    config: dict[str, Any] = Field(default_factory=dict)


class SectionFieldResponse(BaseModel):
    id: UUID
    section_id: UUID
    entity_field_id: UUID | None
    display_order: int
    config: dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


class FormSectionCreate(BaseModel):
    section_type: str = Field(..., min_length=1, max_length=50)
    entity_id: UUID | None = None
    title: str = Field(..., min_length=1, max_length=200)
    config: dict[str, Any] = Field(default_factory=dict)
    fields: list[SectionFieldCreate] = Field(default_factory=list)


class FormSectionUpdate(BaseModel):
    title: str | None = None
    display_order: int | None = None
    config: dict[str, Any] | None = None
    fields: list[SectionFieldCreate] | None = None


class FormSectionResponse(BaseModel):
    id: UUID
    form_id: UUID
    section_type: str
    entity_id: UUID | None
    title: str
    display_order: int
    config: dict[str, Any]
    created_at: datetime
    fields: list[SectionFieldResponse] = []

    model_config = {"from_attributes": True}


class FormCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    primary_entity_id: UUID
    sections: list[FormSectionCreate] = Field(default_factory=list)


class FormUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    sections: list[FormSectionCreate] | None = None


class FormResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    primary_entity_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime | None
    sections: list[FormSectionResponse] = []

    model_config = {"from_attributes": True}


class FormListResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    primary_entity_id: UUID
    created_by: UUID
    created_at: datetime
    section_count: int = 0

    model_config = {"from_attributes": True}


class FormSubmissionData(BaseModel):
    header: dict[str, Any] = Field(default_factory=dict)
    lookups: dict[str, str] = Field(default_factory=dict)
    detail_lines: list[dict[str, Any]] = Field(default_factory=list)


class FormSubmissionResult(BaseModel):
    success: bool = True
    header_id: UUID | None = None
    detail_ids: list[UUID] = Field(default_factory=list)
    message: str = "Formulario enviado exitosamente"
