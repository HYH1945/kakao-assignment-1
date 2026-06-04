import "./TimeLoop.css";

export default function TimeLoopUI({
  timeLeft, loopCount, cluesFound, isSolved, isPaused,
  onCollectClue, onTogglePause,
}) {
  const isUrgent = timeLeft <= 5 && !isSolved && !isPaused;

  return (
    <div className="tl-wrap">
      <h1 className="tl-title">🔁 타임루프 작전</h1>
      <p className="tl-desc">
        {isSolved
          ? "모든 단서를 수집해 사건을 해결했습니다. 루프는 끝났습니다."
          : "15초 안에 단서 3개를 모으세요. 실패하면 시간이 되돌아갑니다."}
      </p>

      <div className={`tl-timer ${isUrgent ? "urgent" : ""} ${isSolved ? "solved-timer" : ""} ${isPaused ? "paused-timer" : ""}`}>
        <span className="tl-timer-label">남은 시간</span>
        <span className="tl-timer-value">
          {isSolved ? "—" : `${timeLeft}초`}
        </span>
      </div>

      <div className="tl-status">
        <div className="tl-stat">
          <span>🔁 루프</span>
          <strong>{loopCount}회</strong>
        </div>
        <div className="tl-stat">
          <span>⏱ 상태</span>
          <strong>{isSolved ? "완료" : isPaused ? "정지" : "진행 중"}</strong>
        </div>
        <div className="tl-stat">
          <span>🔍 단서</span>
          <strong>{cluesFound} / 3</strong>
        </div>
      </div>

      {isSolved ? (
        <div className="tl-complete">✅ 미션 완수 — 타임루프 종료</div>
      ) : (
        <div className="tl-actions">
          <button className="tl-btn clue" onClick={onCollectClue} disabled={cluesFound >= 3}>
            🔍 단서 수집
          </button>
          <button className={`tl-btn pause ${isPaused ? "resume" : ""}`} onClick={onTogglePause}>
            {isPaused ? "▶ 재개" : "⏸ 일시정지"}
          </button>
        </div>
      )}
    </div>
  );
}
