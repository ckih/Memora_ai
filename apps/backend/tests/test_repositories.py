import json

import pgvector.sqlalchemy
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.types import UserDefinedType


# Define a dummy Vector type for SQLite that handles list serialization
class MockVector(UserDefinedType):
    def __init__(self, dim):
        self.dim = dim

    def get_col_spec(self, **kw):
        return "TEXT"

    def bind_processor(self, dialect):
        def process(value):
            return json.dumps(value)

        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            return json.loads(value)

        return process


# Patch pgvector.sqlalchemy.Vector before importing models
pgvector.sqlalchemy.Vector = MockVector

from db.base import Base
from repositories.candidate_repo import CandidateRepository
from repositories.memory_repo import MemoryRepository

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_candidate_repo(db):
    repo = CandidateRepository(db)
    candidate = repo.create(id="user_1", full_name="John Doe", email="john@example.com")
    assert candidate.full_name == "John Doe"

    fetched = repo.get_by_id("user_1")
    assert fetched.email == "john@example.com"


def test_memory_repo(db):
    repo = MemoryRepository(db)
    # Note: we can't test similarity search in SQLite easily, but we can test CRUD
    entry = repo.create(
        user_id="user_1", content="Experienced in Python", embedding=[0.1] * 1536, metadata={"source": "interview"}
    )
    assert entry.content == "Experienced in Python"

    memories = repo.list_by_user("user_1")
    assert len(memories) == 1
    assert memories[0].embedding == [0.1] * 1536
