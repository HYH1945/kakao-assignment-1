import { useState, useEffect } from 'react';

const STORAGE_KEY = 'vanilla-todo-app-data';

export function useTodos() {
  // 로컬 스토리지에서 초기 데이터를 불러옵니다.
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos);
      } catch (e) {
        console.error("로컬 스토리지 데이터를 파싱하는 중 오류가 발생했습니다.", e);
        return [];
      }
    }
    return []; 
  });

  // 상태가 변경될 때마다 로컬 스토리지에 자동 저장합니다.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // 새로운 할 일 추가
  // App.jsx에서 관리하는 selectedDate를 인자로 받아서 생성합니다.
  const handleAddTodo = (text, date) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      date, 
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  // 할 일 완료 상태 토글
  const handleToggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 할 일 삭제
  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // 할 일 수정
  const handleEditTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // 컴포넌트에서 사용할 수 있도록 상태와 함수들을 객체로 반환합니다.
  return {
    todos,
    handleAddTodo,
    handleToggleComplete,
    handleDeleteTodo,
    handleEditTodo,
  };
}
