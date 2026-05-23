from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from deps import SessionLocal, get_db
from repositories.candidate_repo import CandidateRepository
from repositories.memory_repo import MemoryRepository
from services.llm_service import LLMService
from services.memory_agent import MemoryAgent
from services.outreach_service import OutreachService

router = APIRouter()


async def process_weekly_reflection(user_id: str):
    db = SessionLocal()
    try:
        llm = LLMService()
        memory_repo = MemoryRepository(db)
        agent = MemoryAgent(llm, memory_repo)
        outreach = OutreachService(db, llm)

        # 1. Reflect on recent activity (mock history for now)
        history = [{"role": "system", "content": "Weekly consolidation"}]
        summary = await agent.reflect_on_conversation(user_id, history)

        # 2. Generate and log proactive message
        message = await outreach.generate_proactive_message(user_id, summary)
        outreach.log_check_in(user_id, message, channel="email", metadata={"type": "weekly_reflection"})
    finally:
        db.close()


@router.get("/reflect-weekly")
async def trigger_weekly_reflection(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    candidate_repo = CandidateRepository(db)
    candidates = candidate_repo.list()

    for candidate in candidates:
        background_tasks.add_task(process_weekly_reflection, candidate.id)

    return {"message": f"Weekly reflection triggered for {len(candidates)} candidates"}
