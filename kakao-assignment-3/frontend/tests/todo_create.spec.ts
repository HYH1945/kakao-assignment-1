import { test, expect } from '@playwright/test';

test('할 일을 추가하고 목록에서 확인 후 삭제할 수 있다', async ({ page }) => {
  // 1. 새 할 일 페이지로 이동
  await page.goto('http://localhost:3000/todos/new');

  // 2. 폼 요소 확인
  const input = page.locator('input#todo-input');
  const submitButton = page.locator('button[type="submit"]');

  await expect(input).toBeVisible();
  await expect(submitButton).toBeVisible();

  // 3. 할 일 입력 및 제출
  const testTodo = `Playwright E2E 테스트 ${Date.now()}`;
  await input.fill(testTodo);
  await submitButton.click();

  // 4. 목록 페이지로 리다이렉트 되는지 대기
  await page.waitForURL('http://localhost:3000/todos');

  // 5. 방금 추가한 할 일이 목록에 나타나는지 확인
  const todoItem = page.locator('li', { hasText: testTodo });
  await expect(todoItem).toBeVisible();

  // 6. 생성한 투두 토글 (완료 상태로 변경)
  const toggleButton = todoItem.locator('button').first();
  await toggleButton.click();

  // 토글 시 서버 컴포넌트 리렌더링으로 인해 DOM이 갱신되는 시간을 살짝 기다려줌
  await page.waitForTimeout(500);

  // 7. 삭제 (테스트 데이터 정리)
  const deleteButton = todoItem.locator('button').last();
  // 삭제 버튼 클릭을 위해 강제로 호버 상태 트리거 (opacity: 0에서 나타남)
  await todoItem.hover();
  await deleteButton.click({ force: true });
  
  // 목록에서 사라지는지 확인
  await expect(todoItem).not.toBeVisible();
});
