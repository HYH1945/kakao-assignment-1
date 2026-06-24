"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTodo } from "../../actions";

export default function NewTodoPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    
    if (!trimmed) {
      alert("내용을 입력해주세요.");
      return;
    }

    setIsPending(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await createTodo(trimmed, today);
      router.push("/todos");
    } catch (error) {
      console.error(error);
      alert("할 일 추가 중 오류가 발생했습니다.");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <header className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">새 할 일 추가</h1>
          </div>
          <Link href="/todos" className="text-blue-100 hover:text-white" style={{ pointerEvents: isPending ? 'none' : 'auto' }}>
            취소
          </Link>
        </header>

        <main className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="todo-input" className="block text-sm font-medium text-gray-700 mb-1">
                할 일 내용
              </label>
              <input
                id="todo-input"
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="어떤 할 일이 있나요?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isPending}
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              disabled={isPending}
              className={`w-full font-semibold rounded-lg px-6 py-3 transition-colors shadow-sm mt-4 ${
                isPending ? "bg-blue-400 text-gray-100" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isPending ? "추가하는 중..." : "추가하기"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
