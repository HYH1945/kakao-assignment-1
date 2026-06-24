import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app, get_db, Base

# 테스트용 별도 DB 설정
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# get_db 의존성을 테스트용 DB로 교체
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    # 매 테스트 시작 전후로 테스트 DB를 초기화합니다.
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_todo():
    response = client.post(
        "/todos",
        json={"content": "Test Todo", "is_completed": False, "target_date": "2026-06-24"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Test Todo"
    assert data["id"] is not None

def test_get_todos():
    client.post("/todos", json={"content": "Test Todo 1"})
    client.post("/todos", json={"content": "Test Todo 2"})
    
    response = client.get("/todos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

def test_update_todo():
    response = client.post("/todos", json={"content": "Old Todo"})
    todo_id = response.json()["id"]
    
    response = client.put(
        f"/todos/{todo_id}",
        json={"content": "New Todo", "is_completed": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "New Todo"
    assert data["is_completed"] == True

def test_delete_todo():
    response = client.post("/todos", json={"content": "Todo to delete"})
    todo_id = response.json()["id"]
    
    response = client.delete(f"/todos/{todo_id}")
    assert response.status_code == 200
    
    response = client.get("/todos")
    data = response.json()
    assert len(data) == 0
