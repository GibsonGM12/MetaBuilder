"""add entity_relationships table

Revision ID: b3c4d5e6f7a8
Revises: a2b3c4d5e6f7
Create Date: 2026-03-01 23:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'b3c4d5e6f7a8'
down_revision: Union[str, None] = 'a2b3c4d5e6f7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('entity_relationships',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('source_entity_id', sa.UUID(), nullable=False),
        sa.Column('target_entity_id', sa.UUID(), nullable=False),
        sa.Column('relationship_type', sa.String(length=50), nullable=False, server_default='MANY_TO_ONE'),
        sa.Column('source_field_id', sa.UUID(), nullable=False),
        sa.Column('target_display_field', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['source_entity_id'], ['entities.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['target_entity_id'], ['entities.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['source_field_id'], ['entity_fields.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('entity_relationships')
