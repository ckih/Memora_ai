import uuid
from typing import List, Optional

from sqlalchemy.orm import Session

from models.memory import MemoryEntry


class MemoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: str, content: str, embedding: List[float], metadata: dict) -> MemoryEntry:
        memory_id = str(uuid.uuid4())
        db_entry = MemoryEntry(
            id=memory_id, user_id=user_id, content=content, embedding=embedding, metadata_json=metadata
        )
        self.db.add(db_entry)
        self.db.commit()
        self.db.refresh(db_entry)
        return db_entry

    def get_by_id(self, id: str) -> Optional[MemoryEntry]:
        return self.db.query(MemoryEntry).filter(MemoryEntry.id == id).first()

    def list_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[MemoryEntry]:
        return self.db.query(MemoryEntry).filter(MemoryEntry.user_id == user_id).offset(skip).limit(limit).all()

    def match_memories(self, user_id: str, embedding: List[float], limit: int = 5) -> List[MemoryEntry]:
        # Using pgvector similarity operator <=> (cosine distance)
        return (
            self.db.query(MemoryEntry)
            .filter(MemoryEntry.user_id == user_id)
            .order_by(MemoryEntry.embedding.cosine_distance(embedding))
            .limit(limit)
            .all()
        )
