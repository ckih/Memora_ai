from typing import Generator

from openai import OpenAI
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from supabase import Client, create_client

from config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_supabase() -> Generator[Client, None, None]:
    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    yield client


def get_openai() -> Generator[OpenAI, None, None]:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    yield client
