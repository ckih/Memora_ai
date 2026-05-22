from typing import List, Optional

from sqlalchemy.orm import Session

from models.candidate import Candidate


class CandidateRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, id: str, full_name: str, email: str) -> Candidate:
        db_candidate = Candidate(id=id, full_name=full_name, email=email)
        self.db.add(db_candidate)
        self.db.commit()
        self.db.refresh(db_candidate)
        return db_candidate

    def get_by_id(self, id: str) -> Optional[Candidate]:
        return self.db.query(Candidate).filter(Candidate.id == id).first()

    def get_by_email(self, email: str) -> Optional[Candidate]:
        return self.db.query(Candidate).filter(Candidate.email == email).first()

    def list(self, skip: int = 0, limit: int = 100) -> List[Candidate]:
        return self.db.query(Candidate).offset(skip).limit(limit).all()
