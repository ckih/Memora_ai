from sqlalchemy import JSON, Column, DateTime, ForeignKey, String
from sqlalchemy.sql import func

from db.base_class import Base


class CheckIn(Base):
    __tablename__ = "check_ins"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("candidates.id"), index=True)
    content = Column(String)
    channel = Column(String)  # email, slack, etc.
    status = Column(String)  # sent, failed, etc.
    metadata_json = Column(JSON, name="metadata")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
