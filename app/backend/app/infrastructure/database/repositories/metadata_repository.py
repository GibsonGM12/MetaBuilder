from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.infrastructure.database.models import EntityFieldModel, EntityModel


class MetadataRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create_entity(self, entity: EntityModel) -> EntityModel:
        self._session.add(entity)
        await self._session.flush()
        await self._session.refresh(entity)
        return entity

    async def get_entity_by_id(self, entity_id: UUID) -> EntityModel | None:
        stmt = (
            select(EntityModel)
            .where(EntityModel.id == entity_id)
            .options(selectinload(EntityModel.fields))
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_entity_by_name(self, name: str) -> EntityModel | None:
        stmt = select(EntityModel).where(EntityModel.name == name)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all_entities(self) -> list[EntityModel]:
        stmt = select(EntityModel).order_by(EntityModel.created_at.desc())
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def update_entity(self, entity: EntityModel) -> EntityModel:
        await self._session.flush()
        await self._session.refresh(entity)
        return entity

    async def delete_entity(self, entity_id: UUID) -> bool:
        entity = await self.get_entity_by_id(entity_id)
        if not entity:
            return False
        await self._session.delete(entity)
        await self._session.flush()
        return True

    async def create_field(self, field: EntityFieldModel) -> EntityFieldModel:
        self._session.add(field)
        await self._session.flush()
        await self._session.refresh(field)
        return field

    async def get_field_by_id(self, field_id: UUID) -> EntityFieldModel | None:
        stmt = select(EntityFieldModel).where(EntityFieldModel.id == field_id)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def delete_field(self, field_id: UUID) -> bool:
        field = await self.get_field_by_id(field_id)
        if not field:
            return False
        await self._session.delete(field)
        await self._session.flush()
        return True

    async def get_max_display_order(self, entity_id: UUID) -> int:
        from sqlalchemy import func
        stmt = select(func.coalesce(func.max(EntityFieldModel.display_order), 0)).where(
            EntityFieldModel.entity_id == entity_id
        )
        result = await self._session.execute(stmt)
        return result.scalar_one()
