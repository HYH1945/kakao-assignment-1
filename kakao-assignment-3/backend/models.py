from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    is_completed = Column(Boolean, default=False)
    is_starred = Column(Boolean, default=False)
    target_date = Column(String, nullable=True) # YYYY-MM-DD 형식
