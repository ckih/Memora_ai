"""initial migration

Revision ID: 7b2138238506
Revises:
Create Date: 2026-05-21 14:05:00.000000

"""

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision = "7b2138238506"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable pgvector extension
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Create candidates table
    op.create_table(
        "candidates",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("full_name", sa.String(), nullable=True),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_candidates_email"), "candidates", ["email"], unique=True)
    op.create_index(op.f("ix_candidates_full_name"), "candidates", ["full_name"], unique=False)
    op.create_index(op.f("ix_candidates_id"), "candidates", ["id"], unique=False)

    # Create memory_entries table
    op.create_table(
        "memory_entries",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=True),
        sa.Column("content", sa.String(), nullable=True),
        sa.Column("embedding", Vector(1536), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_memory_entries_id"), "memory_entries", ["id"], unique=False)
    op.create_index(op.f("ix_memory_entries_user_id"), "memory_entries", ["user_id"], unique=False)

    # Add HNSW index for embeddings similarity search
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_memory_entries_embedding_hnsw ON memory_entries "
        "USING hnsw (embedding vector_cosine_ops)"
    )

    # Create preferences table
    op.create_table(
        "preferences",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=True),
        sa.Column("settings", sa.JSON(), nullable=True),
        sa.Column("rules", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["candidates.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_preferences_id"), "preferences", ["id"], unique=False)
    op.create_index(op.f("ix_preferences_user_id"), "preferences", ["user_id"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_preferences_user_id"), table_name="preferences")
    op.drop_index(op.f("ix_preferences_id"), table_name="preferences")
    op.drop_table("preferences")
    op.drop_index("ix_memory_entries_embedding_hnsw")
    op.drop_index(op.f("ix_memory_entries_user_id"), table_name="memory_entries")
    op.drop_index(op.f("ix_memory_entries_id"), table_name="memory_entries")
    op.drop_table("memory_entries")
    op.drop_index(op.f("ix_candidates_id"), table_name="candidates")
    op.drop_index(op.f("ix_candidates_full_name"), table_name="candidates")
    op.drop_index(op.f("ix_candidates_email"), table_name="candidates")
    op.drop_table("candidates")
    op.execute("DROP EXTENSION IF EXISTS vector")
