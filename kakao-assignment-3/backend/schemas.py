from pydantic import BaseModel
from typing import Optional

class TodoBase(BaseModel):
    content: str
    is_completed: bool = False
    is_starred: bool = False
    target_date: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    content: Optional[str] = None
    is_completed: Optional[bool] = None
    is_starred: Optional[bool] = None
    target_date: Optional[str] = None

class TodoResponse(TodoBase):
    id: int

    class Config:
        from_attributes = True
