from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from deps import get_db, get_llm_service
from repositories.memory_repo import MemoryRepository
from services.llm_service import LLMService
from services.matching_engine import MatchingEngine

router = APIRouter()


@router.post("/")
async def match_job(
    job_description: str = Body(..., embed=True),
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
    llm: LLMService = Depends(get_llm_service),
):
    repo = MemoryRepository(db)
    engine = MatchingEngine(llm, repo)
    result = await engine.score_job(user_id, job_description)
    return result
