from fastapi import APIRouter

from .endpoints import items, matches, memory, profile

api_router = APIRouter()

api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(memory.router, prefix="/memory", tags=["memory"])
api_router.include_router(matches.router, prefix="/matches", tags=["matches"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])


@api_router.get("/health")
async def health():
    return {"status": "ok"}
