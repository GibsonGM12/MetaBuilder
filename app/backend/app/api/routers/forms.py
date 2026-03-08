from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_admin
from app.application.dto.form_dto import (
    FormCreate,
    FormListResponse,
    FormResponse,
    FormSubmissionData,
    FormSubmissionResult,
    FormUpdate,
)
from app.application.services.form_service import FormService
from app.application.services.form_submission_service import FormSubmissionService
from app.core.database import get_db
from app.infrastructure.database.repositories.dynamic_data_repository import DynamicDataRepository
from app.infrastructure.database.repositories.form_repository import FormRepository
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository

router = APIRouter(prefix="/api/forms", tags=["forms"])


async def _get_form_service(db: AsyncSession = Depends(get_db)) -> FormService:
    return FormService(FormRepository(db), MetadataRepository(db))


async def _get_submission_service(db: AsyncSession = Depends(get_db)) -> FormSubmissionService:
    return FormSubmissionService(FormRepository(db), MetadataRepository(db), DynamicDataRepository(db))


@router.get("", response_model=list[FormListResponse])
async def list_forms(
    service: FormService = Depends(_get_form_service),
    _user: dict = Depends(get_current_user),
):
    return await service.get_all_forms()


@router.post("", response_model=FormResponse, status_code=201)
async def create_form(
    payload: FormCreate,
    service: FormService = Depends(_get_form_service),
    user: dict = Depends(require_admin),
):
    return await service.create_form(payload, user["user_id"])


@router.get("/{form_id}", response_model=FormResponse)
async def get_form(
    form_id: UUID,
    service: FormService = Depends(_get_form_service),
    _user: dict = Depends(get_current_user),
):
    return await service.get_form(form_id)


@router.put("/{form_id}", response_model=FormResponse)
async def update_form(
    form_id: UUID,
    payload: FormUpdate,
    service: FormService = Depends(_get_form_service),
    _user: dict = Depends(require_admin),
):
    return await service.update_form(form_id, payload)


@router.delete("/{form_id}", status_code=204)
async def delete_form(
    form_id: UUID,
    service: FormService = Depends(_get_form_service),
    _user: dict = Depends(require_admin),
):
    await service.delete_form(form_id)


@router.post("/{form_id}/submit", response_model=FormSubmissionResult)
async def submit_form(
    form_id: UUID,
    payload: FormSubmissionData,
    service: FormSubmissionService = Depends(_get_submission_service),
    _user: dict = Depends(get_current_user),
):
    return await service.submit_form(form_id, payload)
