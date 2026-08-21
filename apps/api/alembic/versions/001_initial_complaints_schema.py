"""Initial complaints schema with PII, Triage, Routing, and HITL support

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-20 21:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create complaints table
    op.create_table(
        'complaints',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('external_ticket_id', sa.String(), nullable=True),
        sa.Column('channel', sa.String(), nullable=True, server_default='SP4N_LAPOR_WEB'),
        sa.Column('reported_at', sa.DateTime(), nullable=True),
        sa.Column('reporter_name', sa.String(), nullable=False),
        sa.Column('reporter_nik', sa.String(), nullable=True),
        sa.Column('reporter_phone', sa.String(), nullable=True),
        sa.Column('reporter_email', sa.String(), nullable=True),
        sa.Column('raw_content', sa.Text(), nullable=False),
        sa.Column('masked_content', sa.Text(), nullable=False),
        sa.Column('is_spam', sa.Boolean(), nullable=True, server_default='0'),
        sa.Column('spam_confidence', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('spam_reason', sa.String(), nullable=True),
        sa.Column('pii_detected', sa.JSON(), nullable=True),
        sa.Column('is_duplicate_suspect', sa.Boolean(), nullable=True, server_default='0'),
        sa.Column('similarity_score', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('parent_ticket_id', sa.String(), nullable=True),
        sa.Column('cluster_incident_name', sa.String(), nullable=True),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('sub_category', sa.String(), nullable=True),
        sa.Column('urgency_level', sa.String(), nullable=True, server_default='MEDIUM'),
        sa.Column('urgency_reason', sa.Text(), nullable=True),
        sa.Column('extracted_entities', sa.JSON(), nullable=True),
        sa.Column('sla_deadline_hours', sa.Integer(), nullable=True, server_default='48'),
        sa.Column('recommended_opd_id', sa.String(), nullable=True),
        sa.Column('recommended_opd_name', sa.String(), nullable=True),
        sa.Column('routing_confidence', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('routing_reasoning', sa.Text(), nullable=True),
        sa.Column('alternative_opds', sa.JSON(), nullable=True),
        sa.Column('response_draft_title', sa.String(), nullable=True),
        sa.Column('response_draft_body', sa.Text(), nullable=True),
        sa.Column('response_tone', sa.String(), nullable=True, server_default='Formal Official'),
        sa.Column('status', sa.String(), nullable=True, server_default='PENDING_APPROVAL'),
        sa.Column('assigned_opd_id', sa.String(), nullable=True),
        sa.Column('assigned_opd_name', sa.String(), nullable=True),
        sa.Column('approved_by_asn_name', sa.String(), nullable=True),
        sa.Column('approved_by_asn_nip', sa.String(), nullable=True),
        sa.Column('approved_at', sa.DateTime(), nullable=True),
        sa.Column('override_occurred', sa.Boolean(), nullable=True, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_complaints_id'), 'complaints', ['id'], unique=False)
    op.create_index(op.f('ix_complaints_external_ticket_id'), 'complaints', ['external_ticket_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_complaints_external_ticket_id'), table_name='complaints')
    op.drop_index(op.f('ix_complaints_id'), table_name='complaints')
    op.drop_table('complaints')
