"use client";

import { useState, useEffect } from "react";
import { Todo } from "../types/todo";
import TodoItem from "./TodoItem";
import { getTodos } from "../app/actions";

export default function TodoList({ 
  initialTodos, 
  filter, 
  search, 
  date 
}: { 
  initialTodos: Todo[], 
  filter: string, 
  search: string, 
  date: string 
}) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [hasMore, setHasMore] = useState<boolean>(initialTodos.length === 20);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // URL 파라미터가 바뀌어서 initialTodos가 새로 들어오면 덮어씁니다.
  useEffect(() => {
    setTodos(initialTodos);
    setHasMore(initialTodos.length === 20);
  }, [initialTodos]);

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const nextTodos = await getTodos(filter, search, date, todos.length, 20);
      if (nextTodos.length < 20) {
        setHasMore(false);
      }
      setTodos((prev) => [...prev, ...nextTodos]);
    } catch (error) {
      console.error("Failed to load more todos", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!todos || todos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p className="text-base font-semibold text-gray-600">할 일이 없습니다</p>
        <p className="text-sm mt-1 opacity-70">새로운 할 일을 추가해 보세요!</p>
      </div>
    );
  }

  // 중요도(is_starred)가 true인 항목이 상단으로 오도록 정렬
  // 단, 기존의 id 역순(최신순) 정렬이 기본이므로, 별표시된 항목 안에서도 최신순을 유지합니다.
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.is_starred && !b.is_starred) return -1;
    if (!a.is_starred && b.is_starred) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
      <ul className="flex flex-col gap-3">
        {sortedTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="w-full py-3 mt-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100 disabled:opacity-50"
        >
          {isLoading ? "불러오는 중..." : "더보기 ⬇️"}
        </button>
      )}
    </div>
  );
}
