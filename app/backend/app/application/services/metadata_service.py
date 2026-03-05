import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import text

from app.application.dto.metadata_dto import EntityCreate, EntityUpdate, FieldCreate, LookupItem, RelationshipResponse
from app.infrastructure.database.models import EntityFieldModel, EntityModel, EntityRelationshipModel
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository
from app.infrastructure.database.repositories.relationship_repository import RelationshipRepository
from app.infrastructure.database.table_manager import TableManager


class MetadataService:
    def __init__(
        self,
        repository: MetadataRepository,
        table_manager: TableManager,
        relationship_repo: RelationshipRepository | None = None,
    ):
        self._repo = repository
        self._tm = table_manager
        self._rel_repo = relationship_repo

    async def create_entity(self, data: EntityCreate) -> EntityModel:
        existing = await self._repo.get_entity_by_name(data.name)
        if existing:
            raise HTTPException(status.HTTP_409_CONFLICT, f"La entidad '{data.name}' ya existe")

        entity_id = uuid.uuid4()
        safe_id = str(entity_id).replace("-", "")
        table_name = f"entity_{safe_id}"

        entity = EntityModel(
            id=entity_id,
            name=data.name,
            display_name=data.display_name,
            description=data.description,
            table_name=table_name,
        )

        entity = await self._repo.create_entity(entity)
        await self._tm.create_table(table_name)
        return await self._repo.get_entity_by_id(entity.id)

    async def get_entity(self, entity_id: uuid.UUID) -> EntityModel:
        entity = await self._repo.get_entity_by_id(entity_id)
        if not entity:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Entidad {entity_id} no encontrada")
        return entity

    async def get_all_entities(self) -> list[EntityModel]:
        return await self._repo.get_all_entities()

    async def update_entity(self, entity_id: uuid.UUID, data: EntityUpdate) -> EntityModel:
        entity = await self.get_entity(entity_id)
        if data.display_name is not None:
            entity.display_name = data.display_name
        if data.description is not None:
            entity.description = data.description
        await self._repo.update_entity(entity)
        return await self._repo.get_entity_by_id(entity_id)

    async def delete_entity(self, entity_id: uuid.UUID) -> None:
        entity = await self.get_entity(entity_id)
        table_name = entity.table_name
        await self._repo.delete_entity(entity_id)
        await self._tm.drop_table(table_name)

    async def add_field(self, entity_id: uuid.UUID, data: FieldCreate) -> EntityFieldModel:
        entity = await self.get_entity(entity_id)
        column_name = data.name.lower().replace(" ", "_")
        max_order = await self._repo.get_max_display_order(entity_id)

        if data.field_type == "RELATION":
            if not data.target_entity_id or not data.target_display_field:
                raise HTTPException(
                    status.HTTP_422_UNPROCESSABLE_ENTITY,
                    "Los campos RELATION requieren target_entity_id y target_display_field",
                )
            target = await self._repo.get_entity_by_id(data.target_entity_id)
            if not target:
                raise HTTPException(status.HTTP_404_NOT_FOUND, f"Entidad destino {data.target_entity_id} no encontrada")

        field = EntityFieldModel(
            entity_id=entity_id,
            name=data.name,
            display_name=data.display_name,
            field_type=data.field_type,
            is_required=data.is_required,
            max_length=data.max_length,
            column_name=column_name,
            display_order=max_order + 1,
        )

        created_field = await self._repo.create_field(field)
        await self._tm.add_column(entity.table_name, column_name, data.field_type, data.max_length)

        if data.field_type == "RELATION" and self._rel_repo:
            relationship = EntityRelationshipModel(
                source_entity_id=entity_id,
                target_entity_id=data.target_entity_id,
                relationship_type="MANY_TO_ONE",
                source_field_id=created_field.id,
                target_display_field=data.target_display_field,
            )
            await self._rel_repo.create_relationship(relationship)

        return await self._repo.get_field_by_id(created_field.id)

    async def delete_field(self, entity_id: uuid.UUID, field_id: uuid.UUID) -> None:
        entity = await self.get_entity(entity_id)
        field = await self._repo.get_field_by_id(field_id)
        if not field or field.entity_id != entity_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Campo {field_id} no encontrado en entidad {entity_id}")

        if field.field_type == "RELATION" and self._rel_repo:
            await self._rel_repo.delete_relationship_by_field(field_id)

        await self._repo.delete_field(field_id)
        await self._tm.drop_column(entity.table_name, field.column_name)

    async def get_entity_relationships(self, entity_id: uuid.UUID) -> list[RelationshipResponse]:
        await self.get_entity(entity_id)
        if not self._rel_repo:
            return []
        rels = await self._rel_repo.get_relationships_for_entity(entity_id)
        return [RelationshipResponse.model_validate(r) for r in rels]

    async def lookup_entity_records(
        self, entity_id: uuid.UUID, search: str = "", limit: int = 20
    ) -> list[LookupItem]:
        entity = await self.get_entity(entity_id)
        text_fields = [f for f in entity.fields if f.field_type in ("TEXT",)]
        if not text_fields:
            return []

        display_field = text_fields[0]
        if search:
            sql = text(
                f'SELECT id, "{display_field.column_name}" AS display_value '
                f'FROM "{entity.table_name}" '
                f"WHERE \"{display_field.column_name}\" ILIKE :search "
                f'ORDER BY "{display_field.column_name}" ASC LIMIT :limit'
            )
            from sqlalchemy.ext.asyncio import AsyncSession
            session: AsyncSession = self._repo._session
            result = await session.execute(sql, {"search": f"%{search}%", "limit": limit})
        else:
            sql = text(
                f'SELECT id, "{display_field.column_name}" AS display_value '
                f'FROM "{entity.table_name}" '
                f'ORDER BY "{display_field.column_name}" ASC LIMIT :limit'
            )
            session = self._repo._session
            result = await session.execute(sql, {"limit": limit})

        return [
            LookupItem(id=row["id"], display_value=str(row["display_value"] or ""))
            for row in result.mappings().all()
        ]
