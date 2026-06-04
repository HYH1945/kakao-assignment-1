/**
 * Tailwind CSS 실습
 *
 * 각 섹션 주석을 읽고, 표시된 요소의 className에 Tailwind 클래스를 추가하세요.
 */

export default function App() {
  return (
    <main className="flex w-full flex-1 justify-center px-6 py-6">
      <div className="flex w-full max-w-lg flex-col gap-6 text-left">
        <header className="space-y-3 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Tailwind CSS 실습
          </h1>
          <p className="text-sm leading-relaxed text-slate-500">
            주석의 문제를 해결하며 className을 채워 보세요.
          </p>
        </header>

        {/* ── 1. 텍스트 크기 · 굵기 ───────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-center text-base font-semibold text-slate-800">
            1. 텍스트 크기 · 굵기
          </h2>

          <div className="flex flex-col gap-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-8">
            <div className="rounded-lg bg-white px-6 py-5 ring-1 ring-slate-100">
              {/* 문제
              아래 제목 「Tailwind 연습」의 글자 크기를 3xl, 굵기를 bold로 맞춰 주세요. */}
              <h3 className="">Tailwind 연습</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              위 제목만 스타일을 적용하면 됩니다.
            </p>
          </div>
        </section>

        {/* ── 2. 반응형 ───────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-center text-base font-semibold text-slate-800">
            2. 반응형
          </h2>

          <div className="flex flex-col gap-4 rounded-xl border border-dashed border-sky-300 bg-sky-50/60 p-8">
            <div className="rounded-lg bg-white px-6 py-5 ring-1 ring-slate-100">
              {/* 문제
              제목은 모바일에서 text-xl, md(768px~) 이상에서 text-4xl 이 되게 해 주세요. */}
              <h3 className="">화면 크기에 따라 달라지는 제목</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              브라우저 창 너비를 줄였다 늘려 보세요.
            </p>
          </div>
        </section>

        {/* ── 3. 상태 변화 (Hover) ────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-center text-base font-semibold text-slate-800">
            3. 상태 변화 (Hover)
          </h2>

          <div className="flex justify-center rounded-xl border border-dashed border-violet-300 bg-violet-50/60 p-8">
            {/* 문제
            버튼: 배경 indigo-600, 흰 글씨, 호버 시 배경 indigo-800 */}
            <button
              type="button"
              className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium"
            >
              호버해보세요
            </button>
          </div>
        </section>

        {/* ── 4. Flex · 마진 · 패딩 ───────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-center text-base font-semibold text-slate-800">
            4. Flex · 마진 · 패딩
          </h2>

          <div className="flex flex-col gap-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 p-8">
            {/* 문제
            프로필 바: flex 가로 배치, 양끝 정렬(justify-between), 세로 가운데(items-center), 안쪽 패딩 p-4, 배경 white, 모서리 rounded-lg */}
            <div className="">
              <span className="font-medium text-slate-800">프로필</span>
              <button
                type="button"
                className="rounded-md px-4 py-2 text-sm text-indigo-600 underline"
              >
                설정
              </button>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              점선 박스 안에서 프로필과 설정 버튼이 양쪽 끝에 배치되면
              성공입니다.
            </p>
          </div>
        </section>

        <footer className="border-t border-slate-200 pt-8 text-center text-xs leading-relaxed text-slate-400">
          네 가지 유형을 모두 적용했는지 확인해 보세요.
        </footer>
      </div>
    </main>
  );
}
