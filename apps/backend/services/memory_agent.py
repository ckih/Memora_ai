import json
from typing import Dict, List

from repositories.memory_repo import MemoryRepository
from services.llm_service import LLMService


class MemoryAgent:
    def __init__(self, llm_service: LLMService, memory_repo: MemoryRepository):
        self.llm = llm_service
        self.repo = memory_repo

    async def reflect_on_conversation(self, user_id: str, history: List[Dict[str, str]]) -> str:
        """Summarizes preferences and key takeaways from a conversation."""
        prompt = f"""
        Analyze the following conversation history and extract key user preferences, goals, and professional background.
        Provide a concise summary.

        Conversation:
        {json.dumps(history, indent=2)}
        """
        summary = await self.llm.chat_completion([{"role": "user", "content": prompt}])

        # Store reflection as a memory entry
        embedding = await self.llm.embed_text(summary)
        self.repo.create(user_id=user_id, content=summary, embedding=embedding, metadata={"type": "reflection"})
        return summary

    async def update_profile_from_feedback(self, user_id: str, feedback: str):
        """Updates user profile and memory based on explicit feedback."""
        # Process feedback to extract structured data (simplified here)
        embedding = await self.llm.embed_text(feedback)
        self.repo.create(user_id=user_id, content=feedback, embedding=embedding, metadata={"type": "feedback"})

        # In a real scenario, we might also update the preferences table here
        return {"status": "success"}

    async def trigger_reflection_loop(self, user_id: str):
        """Triggered by cron/scheduler to consolidate recent interactions."""
        # Logic to fetch recent interactions and consolidate them
        pass
