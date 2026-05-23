from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict


class MemoryEntryBase(BaseModel):
    content: str
    metadata_json: Optional[Dict[str, Any]] = None


class MemoryEntryCreate(MemoryEntryBase):
    user_id: str
    embedding: List[float]


class MemoryEntry(MemoryEntryBase):
    id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CandidateBase(BaseModel):
    full_name: str
    email: str


class Candidate(CandidateBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MatchResponse(BaseModel):
    score: int
    explanation: str
