const SCROLL_ROOT_SELECTOR = "[data-sheet-scroll-root]";
/** 패키지 스와이프 상세·인원 선택 하단의 H-AI TIP(추천 질문) 영역 */
export const PACKAGE_SWIPE_FOLLOWUP_ANCHOR_ATTR = "data-package-swipe-followup-anchor";

/**
 * 채팅 스크롤 루트 안에서 스와이프 패널 하단 추천 질문 블록이 보이도록 스크롤합니다.
 */
export function scrollPackageSwipeFollowupIntoView(behavior: ScrollBehavior = "smooth") {
  const root = document.querySelector(SCROLL_ROOT_SELECTOR);
  if (!root) return;
  const el = root.querySelector(`[${PACKAGE_SWIPE_FOLLOWUP_ANCHOR_ATTR}]`) as HTMLElement | null;
  if (!el || !el.isConnected) return;
  el.scrollIntoView({ behavior, block: "end", inline: "nearest" });
}

/**
 * 레이아웃·스프링 애니메이션 이후에 스크롤하도록 예약합니다.
 */
export function scheduleScrollPackageSwipeFollowup(delayMs = 0) {
  const run = () => scrollPackageSwipeFollowupIntoView();
  if (delayMs > 0) {
    requestAnimationFrame(() => {
      setTimeout(run, delayMs);
    });
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
}
