import { FILTER_TYPES } from '../constants/filterTypes'; // Enum Import

// currentFilter: 현재 선택된 탭
// onFilterChange: 탭을 클릭했을 때 부모(App.jsx)의 상태를 바꿔줄 함수
export default function FilterTabs({ currentFilter, onFilterChange }) {
  // 하드코딩된 문자열 대신 Enum 객체의 값을 사용합니다.
  const tabs = [
    { id: FILTER_TYPES.ALL, label: '전체' },
    { id: FILTER_TYPES.ACTIVE, label: '진행중' },
    { id: FILTER_TYPES.COMPLETED, label: '완료' },
  ];

  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => {
        // 현재 탭이 선택된 탭인지 확인하여 스타일을 다르게 줍니다.
        const isActive = currentFilter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)} // 클릭 시 해당 필터 상태로 변경합니다.
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              isActive
                ? 'bg-white text-primary shadow-sm' // 선택되었을 때 (흰색 배경, 파란 글씨)
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200' // 비활성 상태
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
