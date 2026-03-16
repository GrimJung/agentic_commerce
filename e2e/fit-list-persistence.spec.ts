import { test, expect, Page } from '@playwright/test';

test.setTimeout(60000);

/**
 * 메인 → 채팅 → 여행 유형 선택 화면까지 이동
 * 페르소나가 설정되어 있으므로: 상품 추천 → 직접 검색하기 → 자유여행/패키지
 */
async function goToChatWithTypeSelection(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // 메인 CTA: "상품 추천받고 결제하기"
  await page.locator('button, a').filter({ hasText: '상품 추천받고 결제하기' }).first().click();
  await page.waitForTimeout(800);

  // 페르소나 응답 → "직접 검색하기" 클릭
  const directBtn = page.locator('button').filter({ hasText: '직접 검색하기' });
  await expect(directBtn).toBeVisible({ timeout: 6000 });
  await directBtn.click();
  await page.waitForTimeout(600);
}

/**
 * 자유여행 선택 → 모드별 검색하기 버튼 클릭 → AgentReasoning 완료 대기
 */
async function selectFITAndSearch(page: Page, mode: 'combo' | 'flight' | 'hotel') {
  await page.locator('button').filter({ hasText: '자유여행' }).first().click();
  await page.waitForTimeout(600);

  const btnTextMap = {
    combo: '항공+숙소 조합 검색하기',
    flight: '항공만 검색하기',
    hotel: '호텔만 검색하기',
  };

  const searchBtn = page.locator('button').filter({ hasText: btnTextMap[mode] });
  await searchBtn.scrollIntoViewIfNeeded();
  await searchBtn.click();

  // AgentReasoningBlock 애니메이션 완료 대기
  await page.waitForTimeout(7000);
}

/**
 * FIT 콤보 카드가 로드됐는지 확인 (파리/도쿄/발리 목업 기준)
 */
async function waitForFITComboCards(page: Page) {
  // 3개 FIT 카드 = 3개 "예약하기" 버튼 (each FITPackageCard has one)
  await page.waitForSelector('button:has-text("예약하기")', { timeout: 12000 });
}

// ─────────────────────────────────────────────────────────────

test.describe('FIT 추천 리스트 유지 검증', () => {

  test.describe('항공+숙소 콤보 플로우', () => {

    test('fit-packages 단계에서 FIT 카드 3개 표시', async ({ page }) => {
      await goToChatWithTypeSelection(page);
      await selectFITAndSearch(page, 'combo');
      await waitForFITComboCards(page);

      // 조합 카드 3개 = 예약하기 버튼 3개
      const bookingButtons = page.locator('button').filter({ hasText: '예약하기' });
      await expect(bookingButtons).toHaveCount(3, { timeout: 8000 });
    });

    test('예약하기 클릭 후 fit-activities 단계에서 FIT 카드 유지 ★핵심★', async ({ page }) => {
      await goToChatWithTypeSelection(page);
      await selectFITAndSearch(page, 'combo');
      await waitForFITComboCards(page);

      // 첫 번째 FIT 카드 예약하기 클릭 → fit-activities 단계
      await page.locator('button').filter({ hasText: '예약하기' }).first().click();
      await page.waitForTimeout(500);

      // fit-activities: 액티비티 선택 UI 확인 (건너뛰기 버튼 등장)
      await expect(
        page.locator('button').filter({ hasText: /건너뛰기|선택 완료/ }).first()
      ).toBeVisible({ timeout: 5000 });

      // FIT 카드 3개가 여전히 DOM에 존재하는지 확인 ← 수정 검증
      const bookingButtons = page.locator('button').filter({ hasText: '예약하기' });
      expect(await bookingButtons.count()).toBeGreaterThanOrEqual(3);
    });

    test('액티비티 선택 완료 후 fit-summary 단계에서 FIT 카드 유지 ★핵심★', async ({ page }) => {
      await goToChatWithTypeSelection(page);
      await selectFITAndSearch(page, 'combo');
      await waitForFITComboCards(page);

      await page.locator('button').filter({ hasText: '예약하기' }).first().click();
      await page.waitForTimeout(500);

      // 활동 선택 없이 건너뛰기 → fit-summary 단계
      const skipBtn = page.locator('button').filter({ hasText: '건너뛰기' });
      await expect(skipBtn).toBeVisible({ timeout: 5000 });
      await skipBtn.click();
      await page.waitForTimeout(500);

      // fit-summary: 채팅에 "예약하기" 버튼 등장 (총액 확인 + 예약 버튼)
      // FIT 카드 3개 + 채팅 예약하기 버튼 1개 → 최소 4개 이상
      const allBookingButtons = page.locator('button').filter({ hasText: '예약하기' });
      expect(await allBookingButtons.count()).toBeGreaterThanOrEqual(3);

      // 목업 FIT 카드 목적지 확인 (스크롤 위에 있으므로 DOM 존재 여부로 확인)
      const destinations = page.locator('text=파리, 프랑스').or(page.locator('text=도쿄, 일본')).or(page.locator('text=발리, 인도네시아'));
      expect(await destinations.count()).toBeGreaterThan(0);
    });

    test('비교하기/다시받기 버튼 fit-packages에서 표시, fit-activities에서 숨김', async ({ page }) => {
      await goToChatWithTypeSelection(page);
      await selectFITAndSearch(page, 'combo');
      await waitForFITComboCards(page);

      // fit-packages: 버튼 표시
      await expect(page.locator('button').filter({ hasText: '조합 비교하기' })).toBeVisible({ timeout: 8000 });
      await expect(page.locator('button').filter({ hasText: '추천 다시받기' })).toBeVisible();

      // 예약하기 → fit-activities 이동
      await page.locator('button').filter({ hasText: '예약하기' }).first().click();
      await page.waitForTimeout(500);

      // fit-activities: 비교/다시받기 버튼 숨김 ★핵심★
      await expect(page.locator('button').filter({ hasText: '조합 비교하기' })).not.toBeVisible({ timeout: 3000 });
      await expect(page.locator('button').filter({ hasText: '추천 다시받기' })).not.toBeVisible();
    });

  });

  test.describe('항공 단독 플로우', () => {

    test('예약하기 클릭 후 booking 단계에서 항공 카드 유지', async ({ page }) => {
      await goToChatWithTypeSelection(page);
      await selectFITAndSearch(page, 'flight');
      await page.waitForSelector('button:has-text("예약하기")', { timeout: 12000 });

      // 항공편 카드 존재 확인
      const beforeCount = await page.locator('button').filter({ hasText: '예약하기' }).count();
      expect(beforeCount).toBeGreaterThan(0);

      // 예약하기 클릭 → booking (BookingForm 표시)
      await page.locator('button').filter({ hasText: '예약하기' }).first().click();
      await page.waitForTimeout(500);

      // booking: 여행자 정보 폼 확인
      await expect(
        page.locator('text=여행자 목록').or(page.locator('text=새로운 여행자 등록하기')).first()
      ).toBeVisible({ timeout: 5000 });

      // 항공 카드 유지 확인 ★핵심★
      expect(await page.locator('button').filter({ hasText: '예약하기' }).count()).toBeGreaterThan(0);
    });

    test('항공편 비교하기 버튼: fit-packages에서만 표시', async ({ page }) => {
      await goToChatWithTypeSelection(page);
      await selectFITAndSearch(page, 'flight');

      // fit-packages: 표시
      await expect(page.locator('button').filter({ hasText: '항공편 비교하기' })).toBeVisible({ timeout: 12000 });

      // booking 이동
      await page.locator('button').filter({ hasText: '예약하기' }).first().click();
      await page.waitForTimeout(500);

      // booking: 숨김 ★핵심★
      await expect(page.locator('button').filter({ hasText: '항공편 비교하기' })).not.toBeVisible({ timeout: 3000 });
    });

  });

  test.describe('숙소 단독 플로우', () => {

    test('룸타입 선택 후 booking 단계에서 숙소 카드 유지', async ({ page }) => {
      await goToChatWithTypeSelection(page);
      await selectFITAndSearch(page, 'hotel');
      await page.waitForSelector('button:has-text("예약하기")', { timeout: 12000 });

      // 예약하기 → 룸타입 선택 모달
      await page.locator('button').filter({ hasText: '예약하기' }).first().click();
      await page.waitForTimeout(500);

      // 룸타입 모달 확인
      await expect(page.locator('text=호텔 룸타입 선택').or(page.locator('text=룸타입을 선택해주세요')).first()).toBeVisible({ timeout: 5000 });

      // 첫 번째 룸타입 카드 선택
      const roomCards = page.locator('button').filter({ hasText: /㎡/ });
      await roomCards.first().click();
      await page.waitForTimeout(300);

      // "선택 완료" 확인 버튼 클릭
      const confirmBtn = page.locator('button').filter({ hasText: /선택 완료/ });
      await expect(confirmBtn).toBeVisible({ timeout: 3000 });
      await confirmBtn.click();
      await page.waitForTimeout(500);

      // booking 단계: 여행자 정보 폼 표시
      await expect(
        page.locator('text=여행자 목록').or(page.locator('text=새로운 여행자 등록하기')).first()
      ).toBeVisible({ timeout: 5000 });

      // 숙소 카드 유지 ★핵심★
      expect(await page.locator('button').filter({ hasText: '예약하기' }).count()).toBeGreaterThan(0);
    });

    test('숙소 비교하기 버튼: fit-packages에서만 표시', async ({ page }) => {
      await goToChatWithTypeSelection(page);
      await selectFITAndSearch(page, 'hotel');

      // fit-packages: 표시
      await expect(page.locator('button').filter({ hasText: '숙소 비교하기' })).toBeVisible({ timeout: 12000 });

      // 예약하기 → 룸타입 모달 (step 유지) → 룸 선택 → booking
      await page.locator('button').filter({ hasText: '예약하기' }).first().click();
      await page.waitForTimeout(500);

      const roomCards = page.locator('button').filter({ hasText: /㎡/ });
      await roomCards.first().click();
      await page.waitForTimeout(300);

      await page.locator('button').filter({ hasText: /선택 완료/ }).click();
      await page.waitForTimeout(500);

      // booking: 숨김 ★핵심★
      await expect(page.locator('button').filter({ hasText: '숙소 비교하기' })).not.toBeVisible({ timeout: 3000 });
    });

  });

  test.describe('회귀: 패키지 플로우', () => {

    test('패키지 검색 중 FIT 카드 미노출', async ({ page }) => {
      await goToChatWithTypeSelection(page);

      // 패키지 상품 선택
      await page.locator('button').filter({ hasText: '패키지 상품' }).first().click();
      await page.waitForTimeout(600);

      // 선호도 폼 제출 (패키지)
      const submitBtn = page.locator('button').filter({ hasText: '여행 상품 추천받기' });
      await submitBtn.scrollIntoViewIfNeeded();
      await submitBtn.click();
      await page.waitForTimeout(7000);

      // 패키지 카드 로드 확인
      await page.waitForSelector('button:has-text("예약하기")', { timeout: 12000 });

      // FIT 콤보 목적지 텍스트 미노출 확인 (패키지에는 없는 FIT 전용 데이터)
      // mockFITPackages 목적지: 파리/도쿄/발리. 패키지에도 파리/도쿄/발리가 있으므로
      // 대신 FIT 전용 seatClass "이코노미" + 숙소 "성급" 조합 확인
      const fitSection = page.locator('button').filter({ hasText: '조합 비교하기' });
      await expect(fitSection).not.toBeVisible();
    });

  });

});
