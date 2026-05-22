import uuid
from typing import List

from sqlalchemy.orm import Session

from models.check_in import CheckIn
from services.llm_service import LLMService


class OutreachService:
    def __init__(self, db: Session, llm_service: LLMService):
        self.db = db
        self.llm = llm_service

    async def generate_proactive_message(self, user_id: str, context_summary: str) -> str:
        """Generates a personalized outreach message based on user context."""
        prompt = f"""
        Generate a friendly and proactive check-in message for a candidate.
        The message should be suitable for email or Slack and reference their recent progress or preferences.

        Candidate Context:
        {context_summary}

        Message:
        """
        message = await self.llm.chat_completion([{"role": "user", "content": prompt}])
        return message

    def log_check_in(
        self, user_id: str, content: str, channel: str, status: str = "sent", metadata: dict = None
    ) -> CheckIn:
        """Logs an outreach attempt in the database."""
        check_in = CheckIn(
            id=str(uuid.uuid4()),
            user_id=user_id,
            content=content,
            channel=channel,
            status=status,
            metadata_json=metadata or {},
        )
        self.db.add(check_in)
        self.db.commit()
        self.db.refresh(check_in)
        return check_in

    def get_user_activity(self, user_id: str) -> List[CheckIn]:
        """Retrieves outreach history for a specific user."""
        return self.db.query(CheckIn).filter(CheckIn.user_id == user_id).order_by(CheckIn.created_at.desc()).all()

    def list_all_activity(self, limit: int = 100) -> List[CheckIn]:
        """Retrieves all check-in activity (for admin dashboard)."""
        return self.db.query(CheckIn).order_by(CheckIn.created_at.desc()).limit(limit).all()
