"""Add admin auth, audit logs, and OPD active flag."""
from alembic import op
import sqlalchemy as sa

revision = "002_admin_auth_and_audit"
down_revision = "001_initial_schema"
branch_labels = None
depends_on = None

def upgrade():
    op.add_column("opds", sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()))
    op.create_table(
        "users",
        sa.Column("id", sa.String(), primary_key=True), sa.Column("username", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False), sa.Column("email", sa.String(), nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False), sa.Column("role", sa.String(), nullable=False),
        sa.Column("nip", sa.String(), nullable=True), sa.Column("agency", sa.String(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()), sa.Column("created_at", sa.DateTime())
    )
    op.create_index("ix_users_username", "users", ["username"], unique=True)
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), primary_key=True), sa.Column("actor_user_id", sa.String(), nullable=True),
        sa.Column("actor_name", sa.String(), nullable=False), sa.Column("action", sa.String(), nullable=False),
        sa.Column("entity_type", sa.String(), nullable=False), sa.Column("entity_id", sa.String(), nullable=False),
        sa.Column("before_value", sa.JSON(), nullable=True), sa.Column("after_value", sa.JSON(), nullable=True),
        sa.Column("reason", sa.Text(), nullable=True), sa.Column("created_at", sa.DateTime())
    )

def downgrade():
    op.drop_table("audit_logs")
    op.drop_index("ix_users_username", table_name="users")
    op.drop_table("users")
    op.drop_column("opds", "is_active")
