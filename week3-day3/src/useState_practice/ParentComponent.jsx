// [실습 1] name, assets prop을 받아 표시하세요.
// 예시: "아버지 — 500원"

export default function ParentComponent({ name, assets }) {
  return (
    <div className="parent-card">
      <p>
        {name} - {assets}원
      </p>
    </div>
  );
}
