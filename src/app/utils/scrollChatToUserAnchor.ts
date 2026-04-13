const SCROLL_ROOT_SELECTOR = "[data-sheet-scroll-root]";
const USER_ANCHOR_SELECTOR = "[data-chat-user-anchor]";

/**
 * 채팅 스크롤 루트 안에서 가장 최근에 렌더된 사용자 말풍선으로 스크롤·포커스합니다.
 * (에이전트가 생성한 인라인 UI가 붙은 뒤, 질문부터 한 화면에 잡히도록 할 때 사용)
 */
export function scrollChatToLatestUserAnchor(behavior: ScrollBehavior = "smooth") {
  const root = document.querySelector(SCROLL_ROOT_SELECTOR);
  if (!root) return;
  const list = root.querySelectorAll(USER_ANCHOR_SELECTOR);
  const el = list.item(list.length - 1) as HTMLElement | null;
  if (!el) return;
  el.scrollIntoView({ behavior, block: "start" });
  el.focus({ preventScroll: true });
}

/**
 * React 상태 반영·자식 레이아웃 이후에 스크롤하도록 한 프레임(또는 지연) 뒤에 실행합니다.
 */
export function scheduleScrollChatToLatestUserAnchor(delayMs = 0) {
  const run = () => scrollChatToLatestUserAnchor();
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
