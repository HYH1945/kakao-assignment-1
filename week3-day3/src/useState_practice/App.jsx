import FamilyBanner from "./FamilyBanner";
import ParentComponent from "./ParentComponent";
import ChildComponent from "./ChildComponent";
import "../App.css";

// ================================================================
// 실습 1 — components/ 폴더 안의 컴포넌트를 완성하세요.
//
//   ParentComponent.jsx
//     - name, assets prop을 받아 화면에 표시
//     - 예시: "아버지 — 500원"
//
//   ChildComponent.jsx
//     - name, assets, onReceive prop을 받아 화면에 표시
//     - 버튼 클릭 시 onReceive() 호출
//     - 예시: "자녀 — 0원" + [재산 받기] 버튼
// ================================================================

// ================================================================
// 실습 2 — App.jsx에 useState를 추가하여 재산 이전 기능 구현
//
//   [2-1] parentAssets(초기값 500), childAssets(초기값 0) 상태 선언
//   [2-2] handleInherit 함수 작성
//         → childAssets에 parentAssets를 더하고, parentAssets를 0으로
//   [2-3] ParentComponent의 assets prop → parentAssets
//   [2-4] ChildComponent의 assets → childAssets, onReceive → handleInherit
// ================================================================

function App() {
  return (
    <main className="app">
      <h1>useState 실습 — 가문의 재산</h1>
      <FamilyBanner familyName="React 가문" />
      <ParentComponent name="아버지" assets={500} />
      <ChildComponent
        name="자녀"
        assets={0}
        onReceive={() => alert("재산을 받기로 했습니다!")}
      />
    </main>
  );
}

export default App;
