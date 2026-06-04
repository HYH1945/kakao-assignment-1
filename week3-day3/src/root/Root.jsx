import PropsApp from "@/useState_practice/App";
import TimeLoopMission from "@/useEffect_practice/App";

const answer = new URLSearchParams(window.location.search).get("answer");

export default function Root() {
  return (
    <>
      <nav className="mode-nav">
        <a href="/"          className={!answer ? "active" : ""}>실습 1·2</a>
        <a href="?answer=p3" className={answer === "p3" ? "active" : ""}>실습 3</a>
      </nav>
      {!answer         && <PropsApp />}
      {answer === "p3" && <TimeLoopMission />}
    </>
  );
}
