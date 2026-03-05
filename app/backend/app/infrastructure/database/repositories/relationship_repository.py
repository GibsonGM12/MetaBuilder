from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.infrastructure.database.models import EntityRelationshipModel


class RelationshipRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create_relationship(self, relationship: EntityRelationshipModel) -> EntityRelationshipModel:
        self._session.add(relationship)
        await self._session.flush()
        await self._session.refresh(relationship)
        return relationship

    async def get_relationships_for_entity(self, entity_id: UUID) -> list[EntityRelationshipModel]:
        stmt = (
            select(EntityRelationshipModel)
            .where(
                (EntityRelationshipModel.source_entity_id == entity_id)
                | (EntityRelationshipModel.target_entity_id == entity_id)
            )
            .order_by(EntityRelationshipModel.created_at.desc())
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_relationship_by_field(self, field_id: UUID) -> EntityRelationshipModel | None:
        stmt = select(EntityRelationshipModel).where(
            EntityRelationshipModel.source_field_id == field_id
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def delete_relationship(self, relationship_id: UUID) -> bool:
        stmt = select(EntityRelationshipModel).where(EntityRelationshipModel.id == relationship_id)
        result = await self._session.execute(stmt)
        rel = result.scalar_one_or_none()
        if not rel:
            return False
        await self._session.delete(rel)
        await self._session.flush()
        return True

    async def delete_relationship_by_field(self, field_id: UUID) -> bool:
        rel = await self.get_relationship_by_field(field_id)
        if not rel:
            return False
        await self._session.delete(rel)
        await self._session.flush()
        return True
