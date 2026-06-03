from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import get_connection, init_db

app = FastAPI()
init_db()

class MessageResponse(BaseModel):
    id: int
    user_id: int
    content: str
    status: str = "saved"

@app.delete("/messages/{message_id}")
def delete_message(message_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    # ✏️ [실습] message_id에 해당하는 메시지를 삭제하는 DELETE 쿼리를 작성하세요.
    cursor.execute("DELETE FROM messages WHERE id = ?", (message_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    # ✏️ [실습] 삭제된 행이 없으면(deleted == 0) 404 에러를 반환하세요.
    # 여기에 조건문을 작성하세요
    if deleted == 0:
        raise HTTPException(status_code=404, detail="메세지를 찾을 수 없습니다")
    return {"status": "deleted", "message_id": message_id}

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