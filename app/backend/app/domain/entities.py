from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class EntityField:
    name: str
    display_name: str
    field_type: str
    is_required: bool = False
    max_length: int | None = None
    column_name: str = ""
    display_order: int = 0
    id: UUID = field(default_factory=uuid4)
    entity_id: UUID | None = None
    created_at: datetime | None = None

    def __post_init__(self):
        if not self.column_name:
            self.column_name = self.name.lower().replace(" ", "_")


@dataclass
class Entity:
    name: str
    display_name: str
    description: str | None = None
    table_name: str = ""
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None
    fields: list[EntityField] = field(default_factory=list)

    def __post_init__(self):
        if not self.table_name:
            safe_id = str(self.id).replace("-", "")
            self.table_name = f"entity_{safe_id}"


@dataclass
class User:
    username: str
    email: str
    password_hash: str
    role: str = "User"
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None


@dataclass
class EntityRelationship:
    source_entity_id: UUID
    target_entity_id: UUID
    source_field_id: UUID
    target_display_field: str
    relationship_type: str = "MANY_TO_ONE"
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None


@dataclass
class DashboardWidget:
    dashboard_id: UUID
    entity_id: UUID
    widget_type: str
    title: str
    position: dict = field(default_factory=lambda: {"x": 0, "y": 0, "w": 4, "h": 3})
    config: dict = field(default_factory=dict)
    display_order: int = 0
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None


@dataclass
class FormSectionField:
    section_id: UUID
    entity_field_id: UUID | None = None
    display_order: int = 0
    config: dict = field(default_factory=dict)
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None


@dataclass
class FormSection:
    form_id: UUID
    section_type: str
    title: str
    entity_id: UUID | None = None
    display_order: int = 0
    config: dict = field(default_factory=dict)
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None
    fields: list[FormSectionField] = field(default_factory=list)


@dataclass
class Form:
    name: str
    primary_entity_id: UUID
    created_by: UUID
    description: str | None = None
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None
    updated_at: datetime | None = None
    sections: list[FormSection] = field(default_factory=list)


@dataclass
class Dashboard:
    name: str
    created_by: UUID
    description: str | None = None
    is_default: bool = False
    layout_config: dict | None = field(default_factory=lambda: {"cols": 12, "rowHeight": 80})
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None
    updated_at: datetime | None = None
    widgets: list[DashboardWidget] = field(default_factory=list)
