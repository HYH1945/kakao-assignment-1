from fastapi import FastAPI
from pydantic import BaseModel, Field
from database import get_connection, init_db

app = FastAPI()
init_db()  # 서버 시작 시 테이블 자동 생성 (없으면 만들고, 있으면 그냥 넘어감)

# ─── Pydantic 스키마 정의 (API 위쪽에 모아두는 것이 좋습니다) ───

# [요청 스키마] 클라이언트가 보내는 데이터의 형태 정의
class MessageRequest(BaseModel):
    user_id: int
    content: str = Field(min_length=1, max_length=500)  # 빈 문자열 방지, 최대 500자

# [응답 스키마] 서버가 돌려주는 데이터의 형태 정의
class MessageResponse(BaseModel):
    id: int
    user_id: int
    content: str
    status: str = "saved"  # 기본값 "saved"

# ─────────────────────────────────────────────────────────

# response_model=MessageResponse 를 지정하면:
# 1. 반환한 딕셔너리를 자동으로 MessageResponse 형태로 변환 및 검증
# 2. Swagger UI(/docs)에 "이 API는 이런 형태로 응답합니다" 자동 문서화
@app.post("/messages", response_model=MessageResponse)
def create_message(request: MessageRequest):
    conn = get_connection()   # DB 연결 열기
    cursor = conn.cursor()    # SQL을 실행할 커서 생성 (DB와 직접 대화하는 객체)

    # ✏️ [실습] messages 테이블에 user_id와 content를 삽입하는 INSERT 쿼리를 완성하세요.
    # SQL 인젝션 방지를 위해 값 자리에는 ? 를 사용합니다.
    cursor.execute(
        "INSERT INTO messages (user_id, content) VALUES (?, ?)",
        (request.user_id, request.content)
    )

    conn.commit()              # 변경사항을 DB 파일에 확정 저장
    new_id = cursor.lastrowid  # 방금 INSERT된 행의 자동 생성 id 값
    conn.close()               # DB 연결 닫기 (리소스 해제)

    return {
        "id": new_id,
        "user_id": request.user_id,
        "content": request.content,
        "status": "saved",
    }

# 실행 예시:
# POST /messages  Body: {"user_id": 1, "content": "안녕하세요"}
# → {"id": 1, "user_id": 1, "content": "안녕하세요", "status": "saved"}

@app.get("/messages", response_model=list[MessageResponse])
def get_messages():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM messages")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# 실행 예시:
# GET /messages → [{"id": 1, "user_id": 1, "content": "안녕하세요", "status": "saved"}, ...]