import { test, expect } from '@playwright/test';

test.describe('Calendar Weekly View Feature', () => {
  test('달력에서 다른 날짜를 클릭하면 URL이 업데이트되고 데이터가 갱신된다', async ({ page }) => {
    // 1. 페이지 로드
    await page.goto('/todos');

    // 2. 달력 컴포넌트 렌더링 확인 (오늘 날짜 요소가 선택되어 있는지 대략적 확인)
    const calendarStrip = page.locator('.flex.justify-between.overflow-x-auto');
    await expect(calendarStrip).toBeVisible();

    // 3. 테스트용 투두 추가 (오늘 날짜)
    await page.getByRole('link', { name: '새 할 일' }).click();
    await page.waitForURL('**/todos/new');
    const input = page.getByPlaceholder('어떤 할 일이 있나요?');
    await input.fill('오늘치 캘린더 테스트');
    await page.getByRole('button', { name: '추가하기' }).click();
    await page.waitForURL('**/todos*');
    await expect(page.getByText('오늘치 캘린더 테스트')).toBeVisible();

    // 4. 내일 날짜 계산
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    const tomorrowDayNum = tomorrowString.split('-')[2];

    // 5. 달력에서 내일 날짜 버튼 클릭
    // 내일 날짜의 숫자를 포함하는 date-button 찾기
    const tomorrowButton = page.getByTestId('date-button').filter({ hasText: new RegExp(`^.*${parseInt(tomorrowDayNum, 10)}$`) }).first();
    await tomorrowButton.click();

    // 6. URL에 date 쿼리 파라미터가 내일 날짜로 변경되었는지 확인
    await expect(page).toHaveURL(new RegExp(`date=${tomorrowString}`));

    // 7. 내일 날짜에는 '오늘치 캘린더 테스트'가 안 보여야 함 (필터링 동작 확인)
    await expect(page.getByText('오늘치 캘린더 테스트')).toBeHidden();

    // 8. 다시 오늘 날짜 클릭
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const todayDayNum = todayString.split('-')[2];
    const todayButton = page.getByTestId('date-button').filter({ hasText: new RegExp(`^.*${parseInt(todayDayNum, 10)}$`) }).first();
    await todayButton.click();

    // 9. 오늘 날짜로 URL 변경 및 데이터 다시 보임
    await expect(page).toHaveURL(new RegExp(`date=${todayString}`));
    await expect(page.getByText('오늘치 캘린더 테스트')).toBeVisible();

    // 10. 테스트 데이터 정리
    const deleteButton = page.locator('li').filter({ hasText: '오늘치 캘린더 테스트' }).getByRole('button').last();
    await deleteButton.click();
    await expect(page.getByText('오늘치 캘린더 테스트')).toBeHidden();
  });
});
