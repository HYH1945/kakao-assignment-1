import TodoItem from './TodoItem';

// todos: 필터링이 완료된 출력용 배열, onToggle/onDelete/onEdit: 조작 함수들
export default function TodoList({ todos, onToggle, onDelete, onEdit }) {
  // 보여줄 데이터가 하나도 없는 경우(빈 배열) 안내 메시지를 렌더링합니다.
  if (todos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-10">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p className="text-lg font-medium">조회된 내용이 없습니다.</p>
        <p className="text-sm">위에서 새로운 할 일을 추가해 보세요.</p>
      </div>
    );
  }

  // 데이터가 있는 경우 ul 요소 안에 TodoItem 컴포넌트들을 반복해서 그립니다.
  return (
    <ul className="flex-1 overflow-y-auto pr-2 space-y-3">
      {/* map 함수를 사용해 배열의 각 요소를 컴포넌트로 변환합니다. */}
      {todos.map((todo) => (
        <TodoItem 
          key={todo.id} // React가 리스트 항목을 고유하게 식별하기 위해 반드시 필요한 key 값
          todo={todo} 
          onToggle={() => onToggle(todo.id)} // 해당 아이템의 ID를 인자로 넘겨주도록 래핑(wrapping)
          onDelete={() => onDelete(todo.id)}
          onEdit={(newText) => onEdit(todo.id, newText)}
        />
      ))}
    </ul>
  );
}
