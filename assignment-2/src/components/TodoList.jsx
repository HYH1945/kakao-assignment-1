import TodoItem from './TodoItem';

// todos: 필터링이 완료된 할 일 배열
// onToggle, onDelete, onEdit: App.jsx에서 내려받은 조작 함수들
export default function TodoList({ todos, onToggle, onDelete, onEdit }) {
  // 빈 상태(데이터 없음) 처리를 위한 조건부 렌더링
  if (todos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        <p className="text-base font-semibold text-gray-600">할 일이 없습니다</p>
        <p className="text-sm mt-1 opacity-70">상단의 입력창을 통해 새로운 할 일을 추가해 보세요!</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onEdit={(newText) => onEdit(todo.id, newText)}
        />
      ))}
    </ul>
  );
}
