import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import WeekView from './components/WeekView'; 
import { getTodayDateString } from './utils/dateUtils'; 
import { FILTER_TYPES } from './constants/filterTypes'; // Enum Import
import './App.css'; 

function App() {
  const STORAGE_KEY = 'vanilla-todo-app-data';

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Enum을 사용하여 초기 상태를 안전하게 설정합니다.
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);
  
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateString());

  const handleAddTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      date: selectedDate, 
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesDate = todo.date === selectedDate;
    if (!matchesDate) return false;

    // 매직 스트링 대신 Enum을 사용하여 안전하게 비교합니다.
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

          <TodoInput onAdd={handleAddTodo} />
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
