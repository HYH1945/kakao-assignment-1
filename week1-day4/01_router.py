from fastapi import FastAPI,  HTTPException
from pydantic import BaseModel

# 앱 생성은 파일 맨 위에 딱 한 번만 적습니다!
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello, FastAPI!"}

users_database = [
    {"id": 1, "name": "카카오"},
    {"id": 2, "name": "테크캠"},
    {"id": 3, "name": "엘리스"},
    {"id": 4, "name": "tech"},
    {"id": 5, "name": "python"},
]

@app.get("/users")
def get_users():
    return users_database

# GET /users?skip=1&limit=2 → 페이지네이션
@app.get("/users/filtered")
def get_filtered_users(skip: int = 0, limit: int = 2):
    return users_database[skip : skip + limit]

# GET /users/{user_id} → 특정 유저 조회
@app.get("/users/{user_id}")
def get_user(user_id: int):
    for user in users_database:
        if user["id"] == user_id:
            return user

    # 에러 처리 시연 및 실습에 활용할 코드입니다.
    raise HTTPException(
        status_code=404, 
        detail=f"유저 {user_id}를 찾을 수 없습니다"
    )

class UserCreateRequest(BaseModel):
    id: int
    name: str

@app.post("/users")
def create_user(request: UserCreateRequest):
    # 주소창에서 확인하기 위해, 받은 데이터를 리스트에 넣어줍니다.
    users_database.append(request)

    return {
        "status": "success",
        "id": request.id,
        "name": request.name,
    }