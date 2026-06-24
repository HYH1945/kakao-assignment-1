from fastapi.testclient import TestClient
from main import app, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import Base, Todo

# 테스트용 DB 세팅
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    Base.metadata.drop_all(bind=engine)

def test_filter_by_target_date():
    # 데이터 추가
    client.post("/todos", json={"content": "오늘 할일", "target_date": "2026-06-24"})
    client.post("/todos", json={"content": "내일 할일", "target_date": "2026-06-25"})
    
    # 오늘 날짜로 쿼리
    response = client.get("/todos?target_date=2026-06-24")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["content"] == "오늘 할일"

    # 내일 날짜로 쿼리
    response = client.get("/todos?target_date=2026-06-25")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["content"] == "내일 할일"
