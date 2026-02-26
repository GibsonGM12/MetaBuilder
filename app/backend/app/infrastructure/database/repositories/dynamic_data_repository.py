import math
from typing import Any
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


class DynamicDataRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def insert_record(self, table_name: str, data: dict[str, Any]) -> dict[str, Any]:
        if not data:
            sql = text(f'INSERT INTO "{table_name}" DEFAULT VALUES RETURNING id, created_at')
            result = await self._session.execute(sql)
        else:
            columns = ", ".join(f'"{k}"' for k in data)
            placeholders = ", ".join(f":{k}" for k in data)
            sql = text(
                f'INSERT INTO "{table_name}" ({columns}) VALUES ({placeholders}) RETURNING id, created_at'
            )
            result = await self._session.execute(sql, data)

        row = result.mappings().one()
        return dict(row)

    async def get_record(self, table_name: str, record_id: UUID) -> dict[str, Any] | None:
        sql = text(f'SELECT * FROM "{table_name}" WHERE id = :id')
        result = await self._session.execute(sql, {"id": record_id})
        row = result.mappings().one_or_none()
        return dict(row) if row else None

    async def get_records(
        self, table_name: str, page: int = 1, page_size: int = 20
    ) -> list[dict[str, Any]]:
        offset = (page - 1) * page_size
        sql = text(
            f'SELECT * FROM "{table_name}" ORDER BY created_at DESC LIMIT :limit OFFSET :offset'
        )
        result = await self._session.execute(sql, {"limit": page_size, "offset": offset})
        return [dict(row) for row in result.mappings().all()]

    async def count_records(self, table_name: str) -> int:
        sql = text(f'SELECT COUNT(*) as cnt FROM "{table_name}"')
        result = await self._session.execute(sql)
        return result.scalar_one()

    async def update_record(
        self, table_name: str, record_id: UUID, data: dict[str, Any]
    ) -> dict[str, Any] | None:
        if not data:
            return await self.get_record(table_name, record_id)

        set_clause = ", ".join(f'"{k}" = :{k}' for k in data)
        sql = text(
            f'UPDATE "{table_name}" SET {set_clause} WHERE id = :_record_id RETURNING id, created_at'
        )
        params = {**data, "_record_id": record_id}
        result = await self._session.execute(sql, params)
        row = result.mappings().one_or_none()
        if not row:
            return None
        return await self.get_record(table_name, record_id)

    async def delete_record(self, table_name: str, record_id: UUID) -> bool:
        sql = text(f'DELETE FROM "{table_name}" WHERE id = :id')
        result = await self._session.execute(sql, {"id": record_id})
        return result.rowcount > 0

    @staticmethod
    def calc_total_pages(total: int, page_size: int) -> int:
        return max(1, math.ceil(total / page_size))
