from typing import List

from openai import OpenAI

from config import settings


class LLMService:
    def __init__(self, api_key: str = settings.OPENAI_API_KEY):
        self.client = OpenAI(api_key=api_key)

    def embed_text(self, text: str) -> List[float]:
        response = self.client.embeddings.create(input=text, model="text-embedding-3-small")
        return response.data[0].embedding

    def chat_completion(self, messages: List[dict], model: str = "gpt-4o-mini", temperature: float = 0.7) -> str:
        response = self.client.chat.completions.create(model=model, messages=messages, temperature=temperature)
        return response.choices[0].message.content
