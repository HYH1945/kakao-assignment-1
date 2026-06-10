import { useState, useRef, useEffect } from 'react';

// todo: 할 일 객체 자체 (id, text, completed, date 포함)
// onToggle, onDelete, onEdit: 부모(TodoList -> App)에서 내려받은 조작 함수들
export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  // 현재 항목이 '수정 모드'인지 판별하는 상태
  const [isEditing, setIsEditing] = useState(false);
  
  // 수정 모드일 때 입력창에 보여질 임시 텍스트 상태
  const [editText, setEditText] = useState(todo.text);
  
  // 수정 모드로 진입했을 때 <input> 요소에 강제로 포커스를 주기 위한 참조(ref) 객체
  const inputRef = useRef(null);

  // isEditing 상태가 바뀔 때마다 실행되는 부수 효과(Effect) 함수
  useEffect(() => {
    // 수정 모드가 켜졌고(inputRef가 존재하면) 
    if (isEditing && inputRef.current) {
      inputRef.current.focus(); // 입력창에 깜빡이는 커서를 자동으로 위치시킵니다.
    }
  }, [isEditing]);

  // 수정 내용을 실제 데이터에 반영하는 함수
  const handleEditSubmit = () => {
    const trimmed = editText.trim();
    // 빈 값 검증: 내용을 다 지우고 저장하려 하면 경고 후 원래 텍스트로 되돌림
    if (!trimmed) {
      alert('수정할 내용을 입력해 주세요.');
      setEditText(todo.text); // 원래 텍스트로 복구
      setIsEditing(false);    // 읽기 모드로 전환
      return;
    }
    
    // 정상적인 내용이면 부모(App.jsx)의 수정 함수를 호출
    onEdit(trimmed);
    setIsEditing(false); // 수정 완료 후 읽기 모드로 전환
  };

  // 키보드 입력을 감지하여 수정 완료/취소 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit(); // 엔터 키를 누르면 저장
    } else if (e.key === 'Escape') {
      setEditText(todo.text); // ESC 키를 누르면 수정 취소 및 원래대로 복구
      setIsEditing(false);
    }
  };

  return (
    // 완료 상태(todo.completed)에 따라 회색 배경 등 스타일을 다르게 적용합니다.
    <li className={`flex items-center gap-3 p-4 bg-white border rounded-xl shadow-sm transition-all duration-200 group hover:shadow-md ${todo.completed ? 'border-gray-200 bg-gray-50' : 'border-gray-100'}`}>
      
      {/* 
        완료 토글 버튼 (커스텀 체크박스) 
        - todo.completed가 true이면 파란 배경과 체크 표시
        - onClick에 onToggle(즉, App.jsx의 handleToggleComplete)이 연결되어 있음
      */}
      <button 
        type="button"
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed 
            ? 'bg-primary border-primary text-white' 
            : 'border-gray-300 text-transparent hover:border-primary'
        }`}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
        </svg>
      </button>

      {/* 할 일 텍스트 내용 영역 */}
      <div className="flex-1 min-w-0">
        {/* isEditing이 true이면(수정 모드) <input>을, false이면(읽기 모드) <p> 태그를 보여줍니다 (조건부 렌더링). */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-gray-50 border-b-2 border-primary focus:outline-none px-1 py-0.5 text-gray-800"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEditSubmit} // 입력창 바깥을 클릭(포커스 잃음)해도 저장됨
          />
        ) : (
          <p 
            className={`truncate transition-all ${
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-800 font-medium'
            }`}
            onDoubleClick={() => setIsEditing(true)} // 더블클릭 시 수정 모드로 진입
          >
            {todo.text}
          </p>
        )}
      </div>

      {/* 액션 버튼 그룹 (수정, 삭제) : 평소엔 투명하다가 hover 시 나타납니다. */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {/* 수정 모드가 아닐 때만 '수정 버튼'을 보여줍니다. */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)} // 클릭 시 수정 모드로 진입
            className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-blue-50 transition-colors"
            aria-label="Edit todo"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        
        {/* 삭제 버튼: 클릭 시 부모(App.jsx)의 삭제 함수 호출 */}
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          aria-label="Delete todo"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}
