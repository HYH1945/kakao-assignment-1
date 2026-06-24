import Link from "next/link";
import CalendarStrip from "../../components/CalendarStrip";
import FilterTabs from "../../components/FilterTabs";
import SearchBar from "../../components/SearchBar";
import TodoList from "../../components/TodoList";
import { getTodos } from "../actions";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const filter = (resolvedParams.filter as string) || "ALL";
  const search = (resolvedParams.search as string) || "";
  
  // 한국 시간(또는 로컬 타임존) 기준 오늘의 YYYY-MM-DD 구하기
  let date = resolvedParams.date as string;
  if (!date) {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    date = new Date(today.getTime() - offset).toISOString().split('T')[0];
  }
  
  // FastAPI 백엔드에 필터, 검색, 날짜 조건을 직접 넘겨서 페칭
  const filteredTodos = await getTodos(filter, search, date);

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <header className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Todo List</h1>
            <p className="opacity-80 mt-1">Next.js + FastAPI 마이그레이션</p>
          </div>
          <Link href="/todos/new" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-50">
            새 할 일
          </Link>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-4">
          <CalendarStrip selectedDate={date} />
          <SearchBar />
          <FilterTabs />
          <TodoList initialTodos={filteredTodos} filter={filter} search={search} date={date} />
        </main>
      </div>
    </div>
  );
}
