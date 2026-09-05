"""Add admin auth, audit logs, and OPD active flag."""
from alembic import op
import sqlalchemy as sa

revision = "002_admin_auth_and_audit"
down_revision = "001_initial_schema"
branch_labels = None
depends_on = None

def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    # Create opds table if it doesn't exist yet
    if "opds" not in tables:
        op.create_table(
            "opds",
            sa.Column("id", sa.String(), primary_key=True),
            sa.Column("name", sa.String(), nullable=False),
            sa.Column("code", sa.String(), nullable=False),
            sa.Column("jurisdiction", sa.String(), nullable=True, server_default="KOTA_KABUPATEN"),
            sa.Column("scope", sa.JSON(), nullable=True),
            sa.Column("sla_standard_hours", sa.Integer(), nullable=True, server_default="48"),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
        )
        op.create_index("ix_opds_id", "opds", ["id"], unique=False)
    else:
        columns = [c["name"] for c in inspector.get_columns("opds")]
        if "is_active" not in columns:
            op.add_column("opds", sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()))

    # Create system_settings table if it doesn't exist
    if "system_settings" not in tables:
        op.create_table(
            "system_settings",
            sa.Column("key", sa.String(), primary_key=True),
            sa.Column("value", sa.String(), nullable=False),
            sa.Column("description", sa.String(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
        )
        op.create_index("ix_system_settings_key", "system_settings", ["key"], unique=False)

    # Create users table
    if "users" not in tables:
        op.create_table(
            "users",
            sa.Column("id", sa.String(), primary_key=True),
            sa.Column("username", sa.String(), nullable=False),
            sa.Column("name", sa.String(), nullable=False),
            sa.Column("email", sa.String(), nullable=False),
            sa.Column("password_hash", sa.String(), nullable=False),
            sa.Column("role", sa.String(), nullable=False),
            sa.Column("nip", sa.String(), nullable=True),
            sa.Column("agency", sa.String(), nullable=True),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
            sa.Column("created_at", sa.DateTime(), nullable=True),
        )
        op.create_index("ix_users_username", "users", ["username"], unique=True)

    # Create audit_logs table
    if "audit_logs" not in tables:
        op.create_table(
            "audit_logs",
            sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column("actor_user_id", sa.String(), nullable=True),
            sa.Column("actor_name", sa.String(), nullable=False),
            sa.Column("action", sa.String(), nullable=False),
            sa.Column("entity_type", sa.String(), nullable=False),
            sa.Column("entity_id", sa.String(), nullable=False),
            sa.Column("before_value", sa.JSON(), nullable=True),
            sa.Column("after_value", sa.JSON(), nullable=True),
            sa.Column("reason", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
        )

def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    if "audit_logs" in tables:
        op.drop_table("audit_logs")
    if "users" in tables:
        op.drop_index("ix_users_username", table_name="users")
        op.drop_table("users")
    if "system_settings" in tables:
        op.drop_index("ix_system_settings_key", table_name="system_settings")
        op.drop_table("system_settings")
    if "opds" in tables:
        columns = [c["name"] for c in inspector.get_columns("opds")]
        if "is_active" in columns:
            op.drop_column("opds", "is_active")
