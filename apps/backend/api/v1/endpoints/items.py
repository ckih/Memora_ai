from fastapi import APIRouter, Depends
from deps import get_supabase, get_openai
from auth import get_current_user

router = APIRouter()

@router.get("/")
async def read_items(user_id: str = Depends(get_current_user)):
    return {"message": "Protected items list", "user_id": user_id}

@router.get("/public")
async def read_public_items():
    return {"message": "Public items list"}
