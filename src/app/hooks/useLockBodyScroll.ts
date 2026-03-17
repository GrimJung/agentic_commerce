import { useEffect } from "react";

let lockCount = 0;

function applyLock() {
  if (lockCount === 1) {
    document.body.classList.add("sheet-open");
  }
}

function clearLock() {
  if (lockCount === 0) {
    document.body.classList.remove("sheet-open");
  }
}

/**
 * 바텀시트/모달이 열려 있을 때 배경(대화창) 스크롤이 함께 움직이는 것을 막습니다.
 * 마운트 시 body에 sheet-open 클래스를 추가하고, 언마운트 시 제거합니다.
 * 시트가 중첩되어 열릴 수 있으므로 카운터로 관리합니다.
 * @param active true일 때만 스크롤 잠금 (기본 true). embedded 시트는 false로 호출해 중복 잠금 방지.
 */
export function useLockBodyScroll(active = true): void {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    applyLock();
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      clearLock();
    };
  }, [active]);
}
