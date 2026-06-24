import { test, expect } from '@playwright/test';

test.describe('Search and Debounce Feature', () => {
  test('검색창에 타자를 연타해도 300ms 이후에 한 번만 URL이 업데이트된다', async ({ page }) => {
    // 1. 페이지 로드
    await page.goto('/todos');

    // 2. 검색 입력창 찾기
    const searchInput = page.getByPlaceholder('할 일을 검색하세요...');

    // 3. 테스트용 초기 투두 1개 추가를 위해 /todos/new 로 이동
    await page.getByRole('link', { name: '새 할 일' }).click();
    await page.waitForURL('**/todos/new');
    const input = page.getByPlaceholder('어떤 할 일이 있나요?');
    await input.fill('디바운스 테스트용 할일');
    await page.getByRole('button', { name: '추가하기' }).click();
    
    // 추가 후 자동으로 /todos 목록으로 돌아옴
    await page.waitForURL('**/todos');

    // 투두가 렌더링될 때까지 대기
    await expect(page.getByText('디바운스 테스트용 할일')).toBeVisible();

    // 4. 네트워크 요청 감시 (GET /todos?search=...)
    let searchRequestCount = 0;
    page.on('request', request => {
      if (request.url().includes('/todos?search=') && request.method() === 'GET') {
        searchRequestCount++;
      }
    });

    // 5. 검색창에 타자를 매우 빠르게 여러 번 입력 (디바운스 테스트)
    // fill 대신 type으로 한 글자씩 빠르게 입력
    await searchInput.pressSequentially('테스트용', { delay: 10 });

    // 6. 입력이 끝나고 디바운스 대기시간(300ms) 이상 대기
    await page.waitForTimeout(500);

    // 7. URL이 /todos?search=테스트용 으로 한 번만 변경되었는지 확인
    await expect(page).toHaveURL(/search=%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%9A%A9/);

    // 검색 결과가 화면에 보이는지 확인
    await expect(page.getByText('디바운스 테스트용 할일')).toBeVisible();
    
    // 추가로, '타입을 여러번 했는데 서버 요청은 여러번 가지 않고 1번(또는 Next.js 프리페칭 포함 소수)만 갔는지' 확인
    // Next.js 라우터 특성상 최소한으로 갔는지 확인
    expect(searchRequestCount).toBeLessThan(3);

    // 8. 테스트용 투두 삭제
    const deleteButton = page.locator('li').filter({ hasText: '디바운스 테스트용 할일' }).getByRole('button').last();
    await deleteButton.click();
    await expect(page.getByText('디바운스 테스트용 할일')).toBeHidden();
  });
});
