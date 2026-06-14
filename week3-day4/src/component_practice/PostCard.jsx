export default function PostCard({ post }) {
  return (
    <li key={post.id} className="post-card">
      <div className="post-author">
        <span className="avatar">{post.avatar}</span>
        <strong>{post.author}</strong>
      </div>
      <p className="post-content">{post.content}</p>
    </li>
  );
}
