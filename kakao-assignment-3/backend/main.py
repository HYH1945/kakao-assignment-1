import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import todos

load_dotenv(dotenv_path=".env.local")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 기본 라우트
@app.get("/")
def read_root():
    return {"message": "Hello World"}

# API 라우터 등록
app.include_router(todos.router, prefix="/todos", tags=["todos"])