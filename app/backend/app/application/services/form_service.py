import uuid

from fastapi import HTTPException, status

from app.application.dto.form_dto import (
    FormCreate,
    FormListResponse,
    FormResponse,
    FormUpdate,
    VALID_SECTION_TYPES,
)
from app.infrastructure.database.models import FormModel, FormSectionFieldModel, FormSectionModel
from app.infrastructure.database.repositories.form_repository import FormRepository
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository


class FormService:
    def __init__(self, form_repo: FormRepository, meta_repo: MetadataRepository):
        self._repo = form_repo
        self._meta = meta_repo

    async def create_form(self, payload: FormCreate, user_id: uuid.UUID) -> FormResponse:
        entity = await self._meta.get_entity_by_id(payload.primary_entity_id)
        if not entity:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Entidad {payload.primary_entity_id} no encontrada")

        form = FormModel(
            name=payload.name,
            description=payload.description,
            primary_entity_id=payload.primary_entity_id,
            created_by=user_id,
        )
        created = await self._repo.create_form(form)

        for i, section_data in enumerate(payload.sections):
            if section_data.section_type not in VALID_SECTION_TYPES:
                raise HTTPException(
                    status.HTTP_422_UNPROCESSABLE_ENTITY,
                    f"Tipo de sección inválido: {section_data.section_type}",
                )
            section = FormSectionModel(
                form_id=created.id,
                section_type=section_data.section_type,
                entity_id=section_data.entity_id,
                title=section_data.title,
                display_order=i,
                config=section_data.config,
            )
            added = await self._repo.add_section(section)
            for j, field_data in enumerate(section_data.fields):
                field_model = FormSectionFieldModel(
                    section_id=added.id,
                    entity_field_id=field_data.entity_field_id,
                    display_order=j,
                    config=field_data.config,
                )
                self._repo._session.add(field_model)
            await self._repo._session.flush()

        full = await self._repo.get_form_by_id(created.id)
        return FormResponse.model_validate(full)

    async def get_form(self, form_id: uuid.UUID) -> FormResponse:
        form = await self._repo.get_form_by_id(form_id)
        if not form:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Formulario {form_id} no encontrado")
        return FormResponse.model_validate(form)

    async def get_all_forms(self) -> list[FormListResponse]:
        forms = await self._repo.get_all_forms()
        return [
            FormListResponse(
                id=f.id,
                name=f.name,
                description=f.description,
                primary_entity_id=f.primary_entity_id,
                created_by=f.created_by,
                created_at=f.created_at,
                section_count=len(f.sections),
            )
            for f in forms
        ]

    async def update_form(self, form_id: uuid.UUID, payload: FormUpdate) -> FormResponse:
        form = await self._repo.get_form_by_id(form_id)
        if not form:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Formulario {form_id} no encontrado")

        if payload.name is not None:
            form.name = payload.name
        if payload.description is not None:
            form.description = payload.description

        if payload.sections is not None:
            await self._repo.clear_sections(form_id)
            for i, section_data in enumerate(payload.sections):
                if section_data.section_type not in VALID_SECTION_TYPES:
                    raise HTTPException(
                        status.HTTP_422_UNPROCESSABLE_ENTITY,
                        f"Tipo de sección inválido: {section_data.section_type}",
                    )
                section = FormSectionModel(
                    form_id=form_id,
                    section_type=section_data.section_type,
                    entity_id=section_data.entity_id,
                    title=section_data.title,
                    display_order=i,
                    config=section_data.config,
                )
                added = await self._repo.add_section(section)
                for j, field_data in enumerate(section_data.fields):
                    field_model = FormSectionFieldModel(
                        section_id=added.id,
                        entity_field_id=field_data.entity_field_id,
                        display_order=j,
                        config=field_data.config,
                    )
                    self._repo._session.add(field_model)
                await self._repo._session.flush()

        updated = await self._repo.get_form_by_id(form_id)
        return FormResponse.model_validate(updated)

    async def delete_form(self, form_id: uuid.UUID) -> None:
        deleted = await self._repo.delete_form(form_id)
        if not deleted:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Formulario {form_id} no encontrado")
