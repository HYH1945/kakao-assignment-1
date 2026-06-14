// 🚨 이 App.jsx는 너무 많은 일을 하고 있습니다.
// 각 부분이 어떤 역할을 하는지 파악하고 분리해보세요.

import { POSTS } from "./data/posts";
import "@/App.css";
import Header from "./Header";
import PostCard from "./PostCard";
import Footer from "./Footer";

export default function App() {
  return (
    <div className="app">
      {/* ── 헤더 ─────────────────────────────────── */}
      <Header />

      {/* ── 게시글 목록 ──────────────────────────── */}
      <ul className="post-list">
        {POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>

      {/* ── 하단 통계 ─────────────────────────────── */}
      <Footer postCount={POSTS.length} />
    </div>
  );
}
