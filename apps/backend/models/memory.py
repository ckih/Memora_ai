from pgvector.sqlalchemy import Vector
from sqlalchemy import JSON, Column, DateTime, String
from sqlalchemy.sql import func

from db.base_class import Base


class MemoryEntry(Base):
    __tablename__ = "memory_entries"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    content = Column(String)
    embedding = Column(Vector(1536))  # Assuming OpenAI embeddings
    metadata_json = Column(JSON, name="metadata")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
