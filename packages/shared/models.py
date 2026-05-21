from pydantic import BaseModel

class UserBase(BaseModel):
    id: str
    email: str
    full_name: str | None = None
