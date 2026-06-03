import sqlite3

conn = sqlite3.connect("01_schema.db")
cursor = conn.cursor()

# Step 1. users 테이블 생성
cursor.execute("""
CREATE TABLE users(
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL)
""")

# Step 2. messages 테이블 생성
cursor.execute("""
CREATE TABLE messages(
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES user(id)
                             )
""")

conn.commit()

# Step 3. 데이터 삽입 (건드리지 않아도 됩니다)
cursor.execute("INSERT INTO users (name) VALUES (?)", ("김철수",))
cursor.execute("INSERT INTO users (name) VALUES (?)", ("이영희",))
cursor.execute("INSERT INTO messages (user_id, content) VALUES (?, ?)", (1, "안녕하세요"))
cursor.execute("INSERT INTO messages (user_id, content) VALUES (?, ?)", (1, "날씨가 좋네요"))
cursor.execute("INSERT INTO messages (user_id, content) VALUES (?, ?)", (2, "반갑습니다"))

conn.commit()
conn.close()
print("✅ 완료! chatbot.db 파일을 SQLite Viewer로 열어보세요.")