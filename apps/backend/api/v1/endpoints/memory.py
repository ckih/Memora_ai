from typing import Dict, List

from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from deps import get_db
from repositories.memory_repo import MemoryRepository
from services.llm_service import LLMService
from services.memory_agent import MemoryAgent

router = APIRouter()


@router.post("/reflect")
async def reflect(
    history: List[Dict[str, str]] = Body(...), user_id: str = Depends(get_current_user), db: Session = Depends(get_db)
):
    llm = LLMService()
    repo = MemoryRepository(db)
    agent = MemoryAgent(llm, repo)
    summary = await agent.reflect_on_conversation(user_id, history)
    return {"summary": summary}


@router.get("/")
async def get_memory(user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = MemoryRepository(db)
    memories = repo.list_by_user(user_id)
    return {"memories": memories}
