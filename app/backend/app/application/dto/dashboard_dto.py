from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


VALID_WIDGET_TYPES = {"STAT_CARD", "KPI_CARD", "DATA_GRID", "BAR_CHART", "PIE_CHART", "LINE_CHART", "RECENT_LIST"}


class DashboardCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None


class DashboardUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    is_default: bool | None = None


class WidgetCreate(BaseModel):
    entity_id: UUID
    widget_type: str = Field(..., min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=200)
    position: dict[str, int] = Field(default_factory=lambda: {"x": 0, "y": 0, "w": 4, "h": 3})
    config: dict[str, Any] = Field(default_factory=dict)


class WidgetUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    position: dict[str, int] | None = None
    config: dict[str, Any] | None = None
    entity_id: UUID | None = None
    widget_type: str | None = None


class WidgetResponse(BaseModel):
    id: UUID
    dashboard_id: UUID
    entity_id: UUID
    widget_type: str
    title: str
    position: dict[str, Any]
    config: dict[str, Any]
    display_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class DashboardResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    is_default: bool
    layout_config: dict[str, Any] | None
    created_by: UUID
    created_at: datetime
    updated_at: datetime | None
    widgets: list[WidgetResponse] = []

    model_config = {"from_attributes": True}


class DashboardListResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    is_default: bool
    created_by: UUID
    created_at: datetime
    widget_count: int = 0

    model_config = {"from_attributes": True}


class WidgetDataResponse(BaseModel):
    widget_id: UUID
    widget_type: str
    data: Any
