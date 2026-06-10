from datetime import datetime, timezone
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy import DateTime, Integer, String, Text, create_engine, select
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    Session,
    mapped_column,
    sessionmaker,
)

# ─── ① 데이터베이스 연결 설정 ────────────────────────────────────────────
# blog.db 파일 기반의 SQLite 경로를 설정합니다.
DATABASE_URL = "sqlite:///./blog.db"

# 데이터베이스와 실제 물리적인 연결을 관리하는 engine 객체를 생성합니다.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# 실제 DB 조작을 수행할 세션 객체를 생성하는 SessionLocal 클래스를 정의합니다.
SessionLocal = sessionmaker(bind=engine, autoflush=False)

# 데이터베이스 테이블 선언 시 규칙 공유를 위한 기준 클래스입니다. (SQLAlchemy 2.0+ 표준)
class Base(DeclarativeBase):
    pass


# ─── ② Model (Python 클래스와 DB 테이블 매핑) ────────────────────────────
class Post(Base):
    __tablename__ = "posts"  # 실제 DB에 생성될 테이블 이름

    # 기본키 고유 식별 번호 (인덱스 처리)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    # 제목: 최대 200자, 빈 값 불허
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    # 본문: 텍스트 타입, 빈 값 불허
    content: Mapped[str] = mapped_column(Text, nullable=False)
    # 작성 시간: 기본값으로 현재 시스템의 UTC 표준 시간이 저장됨
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


# 서버 시작 시 정의된 설계도(Base)를 기반으로 아직 DB에 테이블이 없다면 자동 생성합니다.
Base.metadata.create_all(bind=engine)


# ─── Pydantic 스키마 (데이터 유효성 검증용 구조체) ─────────────────────────
class PostCreate(BaseModel):
    title: str
    content: str

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("제목은 비워둘 수 없습니다")
        return v.strip()


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    model_config = {"from_attributes": True}


# ─── FastAPI 앱 초기화 ──────────────────────────────────
app = FastAPI(title="Blog API")


# ─── DB 세션 의존성 주입 (get_db) ──────────────────────────────────────
def get_db():
    db = SessionLocal()  # 요청이 올 때마다 세션 창구 개설
    try:
        yield db         # 라우터 함수 내부로 세션 인스턴스를 전달
    finally:
        db.close()       # API 통신 처리가 완료되면 세션을 안전하게 닫고 자원 반환


# 중복 조회를 방지하고 가독성을 높이기 위해 공통으로 사용하는 단건 조회 헬퍼 함수
def _get_post_or_none(db: Session, post_id: int) -> Post | None:
    return db.scalar(select(Post).where(Post.id == post_id))


# ─── ③ 데이터 조회 API (전체 조회) ──────────────────────────────────────────
@app.get("/posts", response_model=list[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    # 전체 게시글 정보를 리스트 형태로 동기식 반환합니다.
    return db.scalars(select(Post)).all()


@app.get("/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    # ✏️ Q1. Post 테이블에서 id가 post_id와 일치하는 데이터를 찾는 쿼리문(stmt)을 작성하고 실행하세요.
    # 힌트: select(Post).where(조건)와 db.scalar(stmt)를 조합합니다.
    stmt = select(Post).where(____________________)
    post = db.scalar(________)

    # ✏️ Q2. 만약 일치하는 게시글(post)이 없다면, 사용자에게 404 에러를 반환하세요.
    # 힌트: raise HTTPException(status_code=404, detail="...")을 사용합니다.
    if not post:
        raise ___________________________________________

    return post


@app.post("/posts", response_model=PostResponse, status_code=201)
def create_post(data: PostCreate, db: Session = Depends(get_db)):
    try:
        post = Post(title=data.title, content=data.content)
        
        # ✏️ Q1. 데이터를 세션에 임시 추가하고, 실제 DB에 반영한 뒤 최신 정보를 객체에 동기화하세요.
        db._______________(post)
        db._______________()
        db._______________(post)
        return post
    except Exception as e:
        # ✏️ Q2. 에러가 발생했을 때 DB를 원래 상태로 안전하게 되돌리는 코드를 작성하세요.
        db._______________()
        raise HTTPException(status_code=500, detail=f"게시글 생성 실패: {str(e)}")


@app.put("/posts/{post_id}", response_model=PostResponse)
def update_post(post_id: int, data: PostUpdate, db: Session = Depends(get_db)):
    post = _get_post_or_none(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    try:
        if data.title is not None:
            post.title = data.title
        if data.content is not None:
            post.content = data.content
            
        # ✏️ Q1. 변경된 사항을 데이터베이스에 반영하고 최신 정보로 동기화하세요.
        db._______________()
        db._______________(post)
        return post
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"게시글 수정 실패: {str(e)}")


@app.delete("/posts/{post_id}", status_code=204)
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = _get_post_or_none(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    try:
        # ✏️ Q1. 대상을 삭제 목록에 올리고 데이터베이스에 최종 기록하세요.
        db._______________(post)
        db._______________()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"게시글 삭제 실패: {str(e)}")