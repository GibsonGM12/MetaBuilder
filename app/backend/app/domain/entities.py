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
