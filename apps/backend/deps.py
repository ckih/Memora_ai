from typing import Generator
from supabase import create_client, Client
from openai import OpenAI
from config import settings

def get_supabase() -> Generator[Client, None, None]:
    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    yield client

def get_openai() -> Generator[OpenAI, None, None]:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    yield client
