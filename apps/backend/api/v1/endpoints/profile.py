from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from deps import get_db
from repositories.memory_repo import MemoryRepository

router = APIRouter()


@router.get("/memory")
async def get_profile_memory(user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = MemoryRepository(db)
    memories = repo.list_by_user(user_id)
    return {"memories": memories}
