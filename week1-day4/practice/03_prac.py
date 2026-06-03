from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="카카오 데이터 검증 실습")

class MessageRequest(BaseModel):
    # 1. 사용자 ID (필수, 정수형)
    user_id: int
    
    # 2. 메시지 내용 (최소 1자 / 최대 5자)
    content: str = Field(min_length = 1, max_length = 5)
    
    # 3. 최대 토큰 값 (기본값: 500, 최소 100 이상 / 최대 2000 이하)
    # ge=100 (greater than or equal): 100 이상
    # le=2000 (less than or equal): 2000 이하
    max_tokens: int = Field(default=500, ge=100, le=2000)
    
    # 4. 인공지능 창의성 온도 (기본값: 0.7, 0.0 초과 / 1.0 미만)
    # gt=0.0 (greater than): 0.0보다 초과
    # lt=1.0 (less than): 1.0보다 미만
    temperature: float = Field(default=0.7, gt=0.0, lt=1.0)


@app.post("/message")
def create_message(request: MessageRequest):
    return request