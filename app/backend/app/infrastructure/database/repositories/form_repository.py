from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.infrastructure.database.models import FormModel, FormSectionFieldModel, FormSectionModel


class FormRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create_form(self, form: FormModel) -> FormModel:
        self._session.add(form)
        await self._session.flush()
        await self._session.refresh(form, attribute_names=["sections"])
        return form

    async def get_form_by_id(self, form_id: UUID) -> FormModel | None:
        stmt = (
            select(FormModel)
            .where(FormModel.id == form_id)
            .options(
                selectinload(FormModel.sections).selectinload(FormSectionModel.fields)
            )
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all_forms(self) -> list[FormModel]:
        stmt = (
            select(FormModel)
            .options(selectinload(FormModel.sections))
            .order_by(FormModel.created_at.desc())
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def update_form(self, form: FormModel) -> FormModel:
        await self._session.flush()
        await self._session.refresh(form, attribute_names=["sections"])
        return form

    async def delete_form(self, form_id: UUID) -> bool:
        form = await self.get_form_by_id(form_id)
        if not form:
            return False
        await self._session.delete(form)
        await self._session.flush()
        return True

    async def add_section(self, section: FormSectionModel) -> FormSectionModel:
        self._session.add(section)
        await self._session.flush()
        await self._session.refresh(section, attribute_names=["fields"])
        return section

    async def get_section_by_id(self, section_id: UUID) -> FormSectionModel | None:
        stmt = (
            select(FormSectionModel)
            .where(FormSectionModel.id == section_id)
            .options(selectinload(FormSectionModel.fields))
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def delete_section(self, section_id: UUID) -> bool:
        section = await self.get_section_by_id(section_id)
        if not section:
            return False
        await self._session.delete(section)
        await self._session.flush()
        return True

    async def get_max_section_order(self, form_id: UUID) -> int:
        stmt = select(func.coalesce(func.max(FormSectionModel.display_order), 0)).where(
            FormSectionModel.form_id == form_id
        )
        result = await self._session.execute(stmt)
        return result.scalar_one()

    async def clear_sections(self, form_id: UUID) -> None:
        stmt = select(FormSectionModel).where(FormSectionModel.form_id == form_id)
        result = await self._session.execute(stmt)
        sections = result.scalars().all()
        for section in sections:
            await self._session.delete(section)
        await self._session.flush()
