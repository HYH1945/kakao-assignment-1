export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-box error">
      <p>{message}</p>
      <button className="retry-btn" onClick={onRetry}>
        다시 시도
      </button>
    </div>
  );
}
