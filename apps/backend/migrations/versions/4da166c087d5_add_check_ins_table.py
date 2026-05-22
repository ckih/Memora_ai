"""add check_ins table

Revision ID: 4da166c087d5
Revises: 7b2138238506
Create Date: 2026-05-21 14:30:00.000000

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "4da166c087d5"
down_revision = "7b2138238506"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "check_ins",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=True),
        sa.Column("content", sa.String(), nullable=True),
        sa.Column("channel", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["candidates.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_check_ins_id"), "check_ins", ["id"], unique=False)
    op.create_index(op.f("ix_check_ins_user_id"), "check_ins", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_check_ins_user_id"), table_name="check_ins")
    op.drop_index(op.f("ix_check_ins_id"), table_name="check_ins")
    op.drop_table("check_ins")
