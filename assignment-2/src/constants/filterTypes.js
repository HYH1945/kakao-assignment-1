// 필터 상태를 하드코딩된 문자열 대신 사용할 수 있도록 상수 객체(Enum)로 정의합니다.
// Object.freeze를 사용하여 실수로 이 값이 변경되는 것을 방지합니다.
export const FILTER_TYPES = Object.freeze({
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
});
