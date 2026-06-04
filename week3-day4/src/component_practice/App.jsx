// 🚨 이 App.jsx는 너무 많은 일을 하고 있습니다.
// 각 부분이 어떤 역할을 하는지 파악하고 분리해보세요.

import { POSTS } from "./data/posts";
import "@/App.css";

export default function App() {
  return (
    <div className="app">
      {/* ── 헤더 ─────────────────────────────────── */}
      <header className="header">
        <h1>📚 React 피드</h1>
        <span className="online-badge">● 3명 접속 중</span>
      </header>

      {/* ── 게시글 목록 ──────────────────────────── */}
      <ul className="post-list">
        {POSTS.map((post) => (
          <li key={post.id} className="post-card">
            <div className="post-author">
              <span className="avatar">{post.avatar}</span>
              <strong>{post.author}</strong>
            </div>
            <p className="post-content">{post.content}</p>
          </li>
        ))}
      </ul>

      {/* ── 하단 통계 ─────────────────────────────── */}
      <footer className="stats-footer">게시글 {POSTS.length}개</footer>
    </div>
  );
}
