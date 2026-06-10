import { useState, useMemo } from 'react';
import { 
  getMondayOfWeek, 
  getDateOffsetString, 
  formatDateForDisplay, 
  formatShortDateForWeek, 
  getDayLabel,
  getTodayDateString
} from '../utils/dateUtils';

// selectedDate: 현재 선택된 날짜 (YYYY-MM-DD)
// onSelectDate: 날짜를 클릭했을 때 App.jsx의 상태를 변경할 함수
// todos: 해당 날짜의 할 일 개수를 표시하기 위해 전체 데이터를 받습니다.
export default function WeekView({ selectedDate, onSelectDate, todos }) {
  // 현재 화면에 보여주고 있는 주(Week)의 기준일(월요일)을 관리하는 상태입니다.
  // 처음 렌더링될 때는 선택된 날짜가 속한 주의 월요일을 기준으로 삼습니다.
  const [weekAnchorDate, setWeekAnchorDate] = useState(() => getMondayOfWeek(selectedDate));
  
  const today = getTodayDateString();

  // 1주일을 이전/다음으로 이동하는 함수입니다.
  const handleMoveWeek = (offsetWeeks) => {
    // 기준일(월요일)에서 7일씩 빼거나 더합니다.
    const newAnchor = getDateOffsetString(weekAnchorDate, offsetWeeks * 7);
    setWeekAnchorDate(newAnchor);
  };

  // 이번 주의 7일치 날짜 배열을 계산합니다.
  // useMemo를 사용해 weekAnchorDate가 바뀔 때만 다시 계산하도록 최적화합니다.
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(getDateOffsetString(weekAnchorDate, i));
    }
    return dates;
  }, [weekAnchorDate]);

  // 상단에 표시할 현재 주의 범위 텍스트 (예: "2026년 6월 8일 월요일 - 2026년 6월 14일 일요일")
  const weekRangeText = `${formatDateForDisplay(weekAnchorDate)} - ${formatDateForDisplay(weekDates[6])}`;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
      {/* 주 이동 네비게이션 */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => handleMoveWeek(-1)}
          className="p-1 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="이전 주"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm font-semibold text-gray-700">{weekRangeText}</span>
        <button 
          onClick={() => handleMoveWeek(1)}
          className="p-1 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="다음 주"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* 7일치 날짜 칩 영역 */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((dateStr) => {
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;
          // 이 날짜에 해당하는 할 일의 개수를 계산합니다.
          const todoCount = todos.filter(t => t.date === dateStr).length;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`flex flex-col items-center py-2 rounded-lg transition-all ${
                isSelected 
                  ? 'bg-primary text-white shadow-md' 
                  : isToday 
                    ? 'bg-blue-50 text-primary border border-blue-200' 
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className={`text-xs font-medium ${isSelected ? 'opacity-90' : 'opacity-70'}`}>
                {getDayLabel(dateStr)}
              </span>
              <span className={`text-sm font-bold mt-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {formatShortDateForWeek(dateStr)}
              </span>
              <span className={`text-[10px] mt-1 px-1.5 rounded-full ${
                isSelected ? 'bg-white/20' : 'bg-gray-200 text-gray-500'
              }`}>
                {todoCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
