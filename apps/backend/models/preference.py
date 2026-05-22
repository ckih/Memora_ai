from sqlalchemy import JSON, Column, DateTime, ForeignKey, String
from sqlalchemy.sql import func

from db.base_class import Base


class Preference(Base):
    __tablename__ = "preferences"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("candidates.id"), unique=True, index=True)
    settings = Column(JSON)  # Structured JSONB
    rules = Column(JSON)  # Derived rules
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
