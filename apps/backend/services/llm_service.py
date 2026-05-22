from typing import List

from openai import AsyncOpenAI

from config import settings


class LLMService:
    def __init__(self, api_key: str = settings.OPENAI_API_KEY):
        self.client = AsyncOpenAI(api_key=api_key)

    async def embed_text(self, text: str) -> List[float]:
        response = await self.client.embeddings.create(input=text, model="text-embedding-3-small")
        return response.data[0].embedding

    async def chat_completion(self, messages: List[dict], model: str = "gpt-4o-mini", temperature: float = 0.7) -> str:
        response = await self.client.chat.completions.create(model=model, messages=messages, temperature=temperature)
        return response.choices[0].message.content
