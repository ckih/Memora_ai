import json
from typing import Dict

from repositories.memory_repo import MemoryRepository
from services.llm_service import LLMService


class MatchingEngine:
    def __init__(self, llm_service: LLMService, memory_repo: MemoryRepository):
        self.llm = llm_service
        self.repo = memory_repo

    async def score_job(self, user_id: str, job_description: str) -> Dict:
        """Scores a job description against candidate memory and preferences."""
        # 1. Embed job description
        job_embedding = await self.llm.embed_text(job_description)

        # 2. Vector search for relevant memories
        relevant_memories = self.repo.match_memories(user_id, job_embedding, limit=5)
        memories_text = "\n".join([m.content for m in relevant_memories])

        # 3. Use LLM to score and explain
        prompt = f"""
        Score the following job description against the candidate's background and memories.
        Provide a score from 0 to 100 and a brief explanation.

        Candidate Memories:
        {memories_text}

        Job Description:
        {job_description}

        Respond in JSON format: {{"score": 85, "explanation": "..."}}
        """
        response_text = await self.llm.chat_completion([{"role": "user", "content": prompt}], temperature=0)

        try:
            # Basic cleanup of LLM response if it includes markdown blocks
            clean_response = response_text.strip()
            if clean_response.startswith("```json"):
                clean_response = clean_response[7:-3].strip()
            return json.loads(clean_response)
        except Exception:
            return {"score": 0, "explanation": "Failed to parse matching score"}
