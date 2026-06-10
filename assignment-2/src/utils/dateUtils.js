// 오늘 날짜를 YYYY-MM-DD 형식으로 가져옵니다.
export function getTodayDateString() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}

// 날짜 문자열(YYYY-MM-DD)을 UTC 기준 Date 객체로 바꿉니다.
export function getUtcDateFromDateString(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// UTC Date 객체를 YYYY-MM-DD 문자열로 바꿉니다.
export function getDateStringFromUtcDate(date) {
  return date.toISOString().slice(0, 10);
}

// 기준 날짜에서 원하는 일수만큼 이동한 날짜 문자열을 만듭니다.
export function getDateOffsetString(baseDateString, offsetDays) {
  const utcDate = getUtcDateFromDateString(baseDateString);
  utcDate.setUTCDate(utcDate.getUTCDate() + offsetDays);
  return getDateStringFromUtcDate(utcDate);
}

// 기준 날짜가 포함된 주의 월요일을 구합니다.
export function getMondayOfWeek(dateString) {
  const utcDate = getUtcDateFromDateString(dateString);
  const dayOfWeek = utcDate.getUTCDay();
  // 0은 일요일, 1은 월요일입니다.
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  utcDate.setUTCDate(utcDate.getUTCDate() + offsetToMonday);
  return getDateStringFromUtcDate(utcDate);
}

// 날짜를 화면에 보여주기 좋은 긴 형식으로 변환합니다. (예: 2026년 6월 10일 수요일)
export function formatDateForDisplay(dateString) {
  const date = getUtcDateFromDateString(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;  // 0부터 세므로 + 1
  const day = date.getUTCDate();         // 1부터 세서 +1 안해도됨
  
  return `${year}. ${month}. ${day}. (${getDayLabel(dateString)})`; // getdaylabel : 요일 
}

// 주간 뷰의 날짜 칩에서 쓸 짧은 날짜 표현을 만듭니다. (예: 6. 10.)
export function formatShortDateForWeek(dateString) {
  const date = getUtcDateFromDateString(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(date);
}

// 주간 뷰에서 쓸 요일 라벨을 만듭니다. (예: 월, 화, 수)
export function getDayLabel(dateString) {
  const date = getUtcDateFromDateString(dateString);
  return new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(date);
}
