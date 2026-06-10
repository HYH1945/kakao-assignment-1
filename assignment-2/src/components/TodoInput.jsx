import { useState } from 'react';

// onAdd: App.jsx에서 Props로 전달받은 '새 할 일 추가' 함수입니다.
export default function TodoInput({ onAdd }) {
  // 사용자가 입력 필드에 타이핑하는 값을 실시간으로 보관하는 컴포넌트 내부 상태입니다.
  const [inputValue, setInputValue] = useState('');

  // 폼(form)이 제출될 때(엔터를 치거나 추가 버튼을 누를 때) 실행되는 함수입니다.
  const handleSubmit = (e) => {
    e.preventDefault(); // 브라우저가 새로고침되는 기본 폼 제출 동작을 막아줍니다.
    
    // 앞뒤 공백을 제거한 순수 텍스트를 추출합니다.
    const trimmed = inputValue.trim();
    
    // 1. 빈 값 검증: 입력값이 없으면 경고창을 띄우고 함수를 즉시 종료합니다.
    if (!trimmed) {
      alert('Todo 내용을 입력해 주세요.');
      return;
    }

    // 2. 부모 컴포넌트(App)에서 받은 함수를 실행하여 실제 데이터를 상태 배열에 추가합니다.
    onAdd(trimmed);
    
    // 3. 처리가 끝났으므로 다음 입력을 위해 입력창을 빈칸으로 초기화합니다.
    setInputValue(''); 
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* 
        onChange 이벤트: 사용자가 타이핑할 때마다 setInputValue를 통해 상태를 업데이트합니다. 
        value={inputValue}: React 상태값이 입력창의 실제 보이는 값을 지배합니다 (제어 컴포넌트 방식).
      */}
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        placeholder="할 일을 입력하세요..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        type="submit"
        className="bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg px-6 py-3 transition-colors shadow-sm"
      >
        추가
      </button>
    </form>
  );
}
