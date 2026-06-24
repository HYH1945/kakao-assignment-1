"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

// 날짜 유틸리티: 타임존 이슈를 피하기 위해 YYYY-MM-DD 문자열에서 파싱
const parseDate = (str: string) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatHeaderDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};

export default function CalendarStrip({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 보고 있는 주간의 월요일 날짜를 상태로 관리
  const [viewedMonday, setViewedMonday] = useState(() => {
    const date = parseDate(selectedDate);
    const day = date.getDay(); // 0(Sun) ~ 6(Sat)
    const diffToMonday = day === 0 ? 6 : day - 1;
    date.setDate(date.getDate() - diffToMonday);
    return formatDate(date);
  });

  // URL 파라미터가 변경되면, 해당 날짜가 포함된 주로 자동 이동
  useEffect(() => {
    const date = parseDate(selectedDate);
    const day = date.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    date.setDate(date.getDate() - diffToMonday);
    setViewedMonday(formatDate(date));
  }, [selectedDate]);

  const handlePrevWeek = () => {
    const date = parseDate(viewedMonday);
    date.setDate(date.getDate() - 7);
    setViewedMonday(formatDate(date));
  };

  const handleNextWeek = () => {
    const date = parseDate(viewedMonday);
    date.setDate(date.getDate() + 7);
    setViewedMonday(formatDate(date));
  };

  const handleDateClick = (dateString: string) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.set("date", dateString);
    router.push(`?${currentParams.toString()}`);
  };

  const weekDates = useMemo(() => {
    const arr = [];
    const base = parseDate(viewedMonday);
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      arr.push(formatDate(d));
    }
    return arr;
  }, [viewedMonday]);

  const headerText = useMemo(() => {
    if (weekDates.length === 0) return "";
    const start = parseDate(weekDates[0]);
    const end = parseDate(weekDates[6]);
    return `${formatHeaderDate(start)} ~ ${formatHeaderDate(end)}`;
  }, [weekDates]);

  const getDayName = (index: number) => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    return days[index];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
      {/* 상단 네비게이션 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <button 
          onClick={handlePrevWeek}
          className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          aria-label="이전 주"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-bold text-gray-700 tracking-wide">
          {headerText}
        </span>
        <button 
          onClick={handleNextWeek}
          className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          aria-label="다음 주"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 하단 고정형 날짜 렌더링 */}
      <div className="flex justify-between px-2 py-3">
        {weekDates.map((date, index) => {
          const isSelected = date === selectedDate;
          const dayNum = parseInt(date.split('-')[2], 10);
          // 브라우저 로컬 기준으로 오늘 날짜 파악 (UI 하이라이트용)
          const today = new Date();
          const offset = today.getTimezoneOffset() * 60000;
          const localTodayStr = new Date(today.getTime() - offset).toISOString().split('T')[0];
          const isToday = date === localTodayStr;

          return (
            <button
              key={date}
              data-testid="date-button"
              onClick={() => handleDateClick(date)}
              className={`flex flex-col items-center justify-center min-w-[3rem] w-12 h-14 rounded-xl transition-all ${
                isSelected 
                  ? "bg-blue-600 text-white shadow-md transform scale-105" 
                  : isToday
                  ? "bg-blue-50 text-blue-800 font-bold border border-blue-200"
                  : "bg-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span className={`text-xs mb-1 ${isSelected ? "text-blue-100" : isToday ? "text-blue-600 font-bold" : "text-gray-400 font-medium"}`}>
                {getDayName(index)}
              </span>
              <span className={`text-base font-bold ${isSelected ? "text-white" : isToday ? "text-blue-800" : "text-gray-800"}`}>
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
