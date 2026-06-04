import { useState, useEffect } from "react";
import TimeLoopUI from "./TimeLoopUI";

export default function TimeLoopMission() {
  const [timeLeft, setTimeLeft] = useState(15);
  const [loopCount, setLoopCount] = useState(0);
  const [cluesFound, setCluesFound] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const isSolved = cluesFound >= 3;

  // ================================================================
  // useEffect 1 — 타이머
  //
  // setInterval(콜백, 밀리초) : 지정한 ms 간격으로 콜백 반복 실행
  //                            → 반환값(숫자 id)을 변수에 저장해두세요.
  // clearInterval(id)         : setInterval 이 반환한 id 로 반복 중단
  //                            → id 는 위에서 저장한 변수를 활용합니다.
  // ================================================================
  useEffect(
    () => {
      // [문제 1] isSolved 또는 isPaused 가 true 이면 early return 하세요.

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setLoopCount((c) => c + 1);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);

      // [문제 2] interval 을 정리하는 cleanup 함수를 반환하세요.
    },
    [
      /* [문제 3] 의존성 배열을 채우세요. 타이머가 다시 시작돼야 하는 상황을 생각해보세요.
               미션이 완수됐을 때? 일시정지 상태가 바뀔 때? */
    ],
  );

  // ================================================================
  // useEffect 2 — 탭 타이틀 업데이트
  // ================================================================
  useEffect(
    () => {
      document.title =
        loopCount > 0 ? `[루프 ${loopCount}회] 타임루프 작전` : "타임루프 작전";

      // [문제 4] 탭 타이틀을 "실습" 으로 되돌리는 cleanup 함수를 반환하세요.
      //   힌트: document.title = "실습"; 을 cleanup 안에 작성하세요.
    },
    [
      /* [문제 5] 의존성 배열을 채우세요. 탭 타이틀이 바뀌어야 하는 상황은 언제인가요? */
    ],
  );

  function handleCollectClue() {
    if (!isSolved && cluesFound < 3) setCluesFound((c) => c + 1);
  }

  function handleTogglePause() {
    if (!isSolved) setIsPaused((p) => !p);
  }

  return (
    <TimeLoopUI
      timeLeft={timeLeft}
      loopCount={loopCount}
      cluesFound={cluesFound}
      isSolved={isSolved}
      isPaused={isPaused}
      onCollectClue={handleCollectClue}
      onTogglePause={handleTogglePause}
    />
  );
}
