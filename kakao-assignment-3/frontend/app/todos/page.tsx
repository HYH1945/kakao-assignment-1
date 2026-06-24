import Link from "next/link";
import FilterTabs from "../../components/FilterTabs";
import TodoList from "../../components/TodoList";
import { getTodos } from "../actions";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter || "ALL";
  
  // FastAPI 백엔드에서 데이터 페칭
  const allTodos = await getTodos();

  // 필터링 적용
  const filteredTodos = allTodos.filter((todo: any) => {
    if (filter === "ACTIVE") return !todo.is_completed;
    if (filter === "COMPLETED") return todo.is_completed;
    return true;
  });

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
          <FilterTabs />
          <TodoList todos={filteredTodos} />
        </main>
      </div>
    </div>
  );
}
