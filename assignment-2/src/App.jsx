import { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import WeekView from './components/WeekView'; 
import { getTodayDateString } from './utils/dateUtils'; 
import { FILTER_TYPES } from './constants/filterTypes'; 
import { useTodos } from './hooks/useTodos'; // 커스텀 훅 Import
import './App.css'; 

function App() {
  // 1. 비즈니스 로직(데이터)은 커스텀 훅이 전담합니다.
  const { 
    todos, 
    handleAddTodo, 
    handleToggleComplete, 
    handleDeleteTodo, 
    handleEditTodo 
  } = useTodos();

  // 2. UI와 관련된 상태(필터, 선택된 날짜)만 App 컴포넌트가 직접 관리합니다.
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateString());

  // 필터링 과정: 1. 날짜 필터링 -> 2. 상태 필터링
  const filteredTodos = todos.filter((todo) => {
    const matchesDate = todo.date === selectedDate;
    if (!matchesDate) return false;

    if (filter === FILTER_TYPES.ACTIVE) return !todo.completed;
    if (filter === FILTER_TYPES.COMPLETED) return todo.completed;
    return true; 
  });

  return (
    <div className="min-h-screen bg-background py-10 flex justify-center">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <header className="bg-primary p-6 text-white">
          <h1 className="text-3xl font-bold tracking-tight">Todo List</h1>
          <p className="opacity-80 mt-1">Manage your tasks efficiently</p>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-6">
          <WeekView 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
            todos={todos} 
          />

          {/* 할 일을 추가할 때 현재 선택된 날짜를 함께 넘겨줍니다. */}
          <TodoInput onAdd={(text) => handleAddTodo(text, selectedDate)} />
          <FilterTabs currentFilter={filter} onFilterChange={setFilter} />

          <TodoList 
            todos={filteredTodos}
            onToggle={handleToggleComplete}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
