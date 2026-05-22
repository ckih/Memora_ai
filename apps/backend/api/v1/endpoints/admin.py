from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from deps import get_db, get_llm_service
from services.llm_service import LLMService
from services.outreach_service import OutreachService

router = APIRouter()


@router.get("/activity")
async def get_all_activity(db: Session = Depends(get_db), llm: LLMService = Depends(get_llm_service), limit: int = 100):
    outreach = OutreachService(db, llm)
    activity = outreach.list_all_activity(limit=limit)
    return {"activity": activity}
