from fastapi import APIRouter
from .endpoints import items

api_router = APIRouter()

api_router.include_router(items.router, prefix="/items", tags=["items"])

@api_router.get("/health")
async def health():
    return {"status": "ok"}
