from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

FIELD_TYPE_MAP = {
    "TEXT": "VARCHAR({max_length})",
    "NUMBER": "DECIMAL(18,6)",
    "INTEGER": "INTEGER",
    "DATE": "DATE",
    "BOOLEAN": "BOOLEAN",
}


class TableManager:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create_table(self, table_name: str) -> None:
        sql = text(f"""
            CREATE TABLE IF NOT EXISTS "{table_name}" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """)
        await self._session.execute(sql)

    async def add_column(
        self, table_name: str, column_name: str, field_type: str, max_length: int | None = None
    ) -> None:
        pg_type = self._resolve_type(field_type, max_length)
        sql = text(f'ALTER TABLE "{table_name}" ADD COLUMN "{column_name}" {pg_type}')
        await self._session.execute(sql)

    async def drop_column(self, table_name: str, column_name: str) -> None:
        sql = text(f'ALTER TABLE "{table_name}" DROP COLUMN IF EXISTS "{column_name}"')
        await self._session.execute(sql)

    async def drop_table(self, table_name: str) -> None:
        sql = text(f'DROP TABLE IF EXISTS "{table_name}"')
        await self._session.execute(sql)

    @staticmethod
    def _resolve_type(field_type: str, max_length: int | None = None) -> str:
        template = FIELD_TYPE_MAP.get(field_type)
        if not template:
            raise ValueError(f"Tipo de campo no soportado: {field_type}")
        if field_type == "TEXT":
            length = max_length or 255
            return template.format(max_length=length)
        return template
