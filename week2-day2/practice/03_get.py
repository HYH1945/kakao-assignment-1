from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel
from database import get_connection, init_db

app = FastAPI()
init_db()

class MessageResponse(BaseModel):
    id: int
    user_id: int
    content: str
    status: str = "saved"

# 쿼리 파라미터 user_id가 있으면 해당 사용자의 메시지만, 없으면 전체 조회
# 예: GET /messages?user_id=1  →  user_id가 1인 메시지만 반환
# 예: GET /messages            →  전체 메시지 반환
@app.get("/messages", response_model=list[MessageResponse])
def get_messages(user_id: Optional[int] = None):  # user_id는 선택 파라미터 (없으면 None)
    conn = get_connection()
    cursor = conn.cursor()

    if user_id is not None:
        # user_id 조건이 있을 때: WHERE 절로 필터링
        # ✏️ [실습] user_id 조건으로 필터링하는 SELECT 쿼리를 완성하세요.
        cursor.execute(
            "SELECT * FROM messages WHERE user_id = ?", (user_id,)
        )
    else:
        # user_id 조건이 없을 때: 전체 조회
        cursor.execute("SELECT * FROM messages")

    rows = cursor.fetchall()  # 쿼리 결과 전체를 리스트로 가져옴 (결과 없으면 빈 리스트)
    conn.close()

    # dict(row): sqlite3.Row 객체를 Python 딕셔너리로 변환
    # row_factory = sqlite3.Row 설정 덕분에 가능하며, FastAPI가 JSON으로 직렬화하려면 dict가 필요함
    return [dict(row) for row in rows]

# 실행 예시:
# GET /messages           → [{"id": 1, ...}, {"id": 2, ...}]  (전체)
# GET /messages?user_id=1 → [{"id": 1, ...}]                  (user_id=1인 것만)