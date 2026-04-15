'use client';

import React, { useState, useEffect, useCallback } from "react";

export interface ToastConfig {
  msg: string;
  body: string;
  highlight: string;
  chips: string[];
}

export interface ScrollTrigger {
  sectionId: string;
  toastKey: string;
}

interface AgentToastProps {
  toastData: Record<string, ToastConfig>;
  triggers: ScrollTrigger[];
  scrollContainerRef?: React.RefObject<HTMLElement>;
  /** 컴팩트 토스트 자동 숨김 시간 (기본 3초). 구간(toastKey)이 바뀌면 다시 표시. 마지막 트리거 섹션 하단을 지나면 즉시 숨김 */
  autoHideMs?: number;
  /** 스크롤 구간보다 우선 표시 (예: 카드 선택 시). `toastData`에 동일 키가 있어야 함 */
  interactionToastKey?: string | null;
}

const HAI_AVATAR_SRC = "/hai-travel-prep-fab.png";

/**
 * 스크롤 기반 활성 토스트 키.
 * - 트리거 순서대로 `lineY >= 섹션 top` 인 마지막 키를 사용해, 인접한 두 섹션(예: 결제상세 vs CTA) 경계에서
 *   스캔 라인이 좁은 간격 안에서 앞뒤로 움직일 때 `price`/`payment`가 번갈아 깜빡이지 않게 함.
 * - 마지막 트리거 섹션의 bottom 아래로 스캔 라인이 내려가면 null → 컴팩트 토스트 즉시 비활성.
 */
function computeActiveToastKey(
  triggers: ScrollTrigger[],
  container: Window | HTMLElement,
): string | null {
  if (!triggers.length) return null;

  const isWin = container === window;
  const scrollTop = isWin ? window.scrollY : (container as HTMLElement).scrollTop;
  const clientHeight = isWin ? window.innerHeight : (container as HTMLElement).clientHeight;
  const lineY = scrollTop + clientHeight * 0.65;
  const containerTop = isWin ? 0 : (container as HTMLElement).getBoundingClientRect().top;

  let activeKey: string | null = null;
  for (const { sectionId, toastKey } of triggers) {
    const el = document.getElementById(sectionId);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const elTop = rect.top - containerTop + scrollTop;
    if (lineY >= elTop) {
      activeKey = toastKey;
    }
  }

  const lastTrig = triggers[triggers.length - 1];
  const lastEl = lastTrig ? document.getElementById(lastTrig.sectionId) : null;
  if (lastEl) {
    const rect = lastEl.getBoundingClientRect();
    const lastTop = rect.top - containerTop + scrollTop;
    const lastBottom = lastTop + Math.max(rect.height, 1);
    if (lineY >= lastBottom) {
      return null;
    }
  }

  return activeKey;
}

const S = {
  toastWrap: {
    position: 'sticky' as const,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 16px 10px',
    zIndex: 100,
    pointerEvents: 'none' as const,
  },
  toast: (visible: boolean): React.CSSProperties => ({
    pointerEvents: visible ? 'all' : 'none',
    background: 'rgba(30, 18, 60, 0.92)',
    color: '#fff',
    borderRadius: 24,
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    cursor: 'pointer',
    maxWidth: 320,
    boxShadow: '0 4px 16px rgba(94,43,184,0.25)',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: 'opacity 0.3s, transform 0.3s',
  }),
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    flexShrink: 0,
    overflow: 'hidden',
    background: '#e8eef8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  panelAvatarWrap: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e8eef8',
  } as React.CSSProperties,
  toastLabel: { fontWeight: 600, fontSize: 11, color: '#C9B8FF' },
  toastMsg: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  toastArrow: { fontSize: 14, color: 'rgba(255,255,255,0.5)', flexShrink: 0 },
  panel: (visible: boolean): React.CSSProperties => ({
    position: 'sticky' as const,
    bottom: 0,
    background: '#fff',
    borderRadius: visible ? 16 : 0,
    border: visible ? '1.5px solid #5E2BB8' : 'none',
    padding: visible ? 16 : 0,
    zIndex: 200,
    boxShadow: visible ? '0 8px 32px rgba(94,43,184,0.18)' : 'none',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: 'opacity 0.25s, transform 0.25s, padding 0.2s',
    pointerEvents: visible ? 'all' : 'none',
    margin: visible ? '0 12px 8px' : 0,
    maxHeight: visible ? undefined : 0,
    overflow: visible ? undefined : 'hidden',
    visibility: visible ? 'visible' : 'hidden',
  }),
  panelHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  } as React.CSSProperties,
  panelTitle: {
    fontSize: 13, fontWeight: 700, color: '#5E2BB8',
    display: 'flex', alignItems: 'center', gap: 6,
  } as React.CSSProperties,
  closeBtn: {
    width: 24, height: 24, borderRadius: '50%', background: '#EEEEF0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 13, color: '#73747A',
    border: 'none', flexShrink: 0,
  } as React.CSSProperties,
  highlight: {
    background: '#EEEAF8', borderRadius: 6, padding: '8px 10px',
    marginTop: 8, fontSize: 12, color: '#5E2BB8', lineHeight: 1.5,
  } as React.CSSProperties,
  chipRow: { display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginTop: 10 },
  chip: {
    border: '1px solid #5E2BB8', color: '#5E2BB8', borderRadius: 20,
    padding: '5px 12px', fontSize: 11, cursor: 'pointer', background: '#fff',
  } as React.CSSProperties,
};

const AgentToast: React.FC<AgentToastProps> = ({
  toastData,
  triggers,
  scrollContainerRef,
  autoHideMs = 3000,
  interactionToastKey = null,
}) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const panelVisibleRef = React.useRef(panelVisible);
  panelVisibleRef.current = panelVisible;
  const interactionToastKeyRef = React.useRef<string | null>(null);
  interactionToastKeyRef.current = interactionToastKey ?? null;
  const rafScrollRef = React.useRef<number | null>(null);
  const prevActiveKeyRef = React.useRef<string | null>(null);
  const toastDismissedForKeyRef = React.useRef<string | null>(null);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRootRef = React.useRef<HTMLDivElement>(null);
  /** interaction 토스트: 스크롤 구간 안에 들어간 적 있을 때만, 전 구간 이탈 시 즉시 숨김(최상단 일시 null 오탐 방지) */
  const wasInScrollTriggerZoneRef = React.useRef(false);
  const interactionLeftAllZonesRef = React.useRef(false);

  const runScrollSync = useCallback(() => {
    if (panelVisibleRef.current) return;

    const ik = interactionToastKeyRef.current;
    if (ik && toastData[ik]) {
      const container = (scrollContainerRef?.current ?? window) as Window | HTMLElement;
      if (triggers.length > 0) {
        const scrollKey = computeActiveToastKey(triggers, container);
        if (scrollKey != null) {
          wasInScrollTriggerZoneRef.current = true;
          interactionLeftAllZonesRef.current = false;
        } else if (wasInScrollTriggerZoneRef.current) {
          wasInScrollTriggerZoneRef.current = false;
          interactionLeftAllZonesRef.current = true;
          if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
          }
          setToastVisible(false);
          return;
        }
        if (interactionLeftAllZonesRef.current) {
          setToastVisible(false);
          return;
        }
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setCurrentKey(ik);
      setToastVisible(true);
      return;
    }

    const container = (scrollContainerRef?.current ?? window) as Window | HTMLElement;
    const activeKey = computeActiveToastKey(triggers, container);
    setCurrentKey((prev) => (prev === activeKey ? prev : activeKey));

    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    if (activeKey == null) {
      clearHideTimer();
      setToastVisible(false);
      prevActiveKeyRef.current = null;
      toastDismissedForKeyRef.current = null;
      return;
    }

    const prev = prevActiveKeyRef.current;
    const keyChanged = activeKey !== prev;

    if (keyChanged) {
      prevActiveKeyRef.current = activeKey;
      toastDismissedForKeyRef.current = null;
    }

    if (toastDismissedForKeyRef.current === activeKey) {
      setToastVisible(false);
      return;
    }

    if (keyChanged) {
      clearHideTimer();
      setToastVisible(true);
      hideTimerRef.current = setTimeout(() => {
        setToastVisible(false);
        toastDismissedForKeyRef.current = activeKey;
        hideTimerRef.current = null;
      }, autoHideMs);
    }
  }, [triggers, scrollContainerRef, autoHideMs, toastData]);

  useEffect(() => {
    const container = (scrollContainerRef?.current ?? window) as Window | HTMLElement;

    const handleScroll = () => {
      if (rafScrollRef.current != null) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = null;
        runScrollSync();
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    queueMicrotask(runScrollSync);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafScrollRef.current != null) {
        cancelAnimationFrame(rafScrollRef.current);
        rafScrollRef.current = null;
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [runScrollSync, scrollContainerRef]);

  useEffect(() => {
    queueMicrotask(() => runScrollSync());
  }, [interactionToastKey, runScrollSync]);

  useEffect(() => {
    wasInScrollTriggerZoneRef.current = false;
    interactionLeftAllZonesRef.current = false;
  }, [interactionToastKey]);

  /** 상세 패널을 닫은 뒤: 타임아웃으로 숨겼던 동일 구간이어도 토스트를 다시 띄울 수 있게 한 뒤 동기화 */
  useEffect(() => {
    if (panelVisible) return;
    toastDismissedForKeyRef.current = null;
    runScrollSync();
  }, [panelVisible, runScrollSync]);

  /** 상세 도움말 패널이 열린 뒤 스크롤하면 기존 전환 애니메이션으로 자연스럽게 닫힘 */
  useEffect(() => {
    if (!panelVisible) return;
    const container = scrollContainerRef?.current ?? window;
    const getScrollTop = () =>
      container === window ? window.scrollY : (container as HTMLElement).scrollTop;
    const initialTop = getScrollTop();
    const dismissThresholdPx = 12;

    const handleScrollDismiss = () => {
      const nextTop = getScrollTop();
      if (Math.abs(nextTop - initialTop) >= dismissThresholdPx) {
        setPanelVisible(false);
      }
    };

    container.addEventListener('scroll', handleScrollDismiss, { passive: true });
    return () => container.removeEventListener('scroll', handleScrollDismiss);
  }, [panelVisible, scrollContainerRef]);

  /** 상세 패널이 열린 상태에서 패널 바깥 포인터·포커스 액션 시 즉시 닫힘 */
  useEffect(() => {
    if (!panelVisible) return;
    const onPointerDownOutside = (e: PointerEvent) => {
      const root = panelRootRef.current;
      if (!root) return;
      if (root.contains(e.target as Node)) return;
      setPanelVisible(false);
    };
    const onFocusIn = (e: FocusEvent) => {
      const root = panelRootRef.current;
      if (!root) return;
      const t = e.target;
      if (t instanceof Node && root.contains(t)) return;
      setPanelVisible(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelVisible(false);
    };
    document.addEventListener("pointerdown", onPointerDownOutside, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDownOutside, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [panelVisible]);

  const handleToastClick = () => {
    if (!currentKey) return;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setToastVisible(false);
    setPanelVisible(true);
  };

  const handleChipClick = (chip: string) => {
    // TODO: H-AI 채팅 연동 — 아래 중 프로젝트에 맞는 방식으로 교체
    // router.push(`/hai?q=${encodeURIComponent(chip)}`);
    // window.dispatchEvent(new CustomEvent('hai:open', { detail: { query: chip } }));
    console.log('[AgentToast] chip:', chip);
  };

  const current = currentKey ? toastData[currentKey] : null;

  return (
    <>
      <div ref={panelRootRef} style={S.panel(panelVisible)} aria-hidden={!panelVisible}>
        {current && (
          <>
            <div style={S.panelHeader}>
              <div style={S.panelTitle}>
                <span style={S.panelAvatarWrap} aria-hidden>
                  <img
                    src={HAI_AVATAR_SRC}
                    alt=""
                    width={24}
                    height={24}
                    decoding="async"
                    draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </span>
                H-AI 도움말
              </div>
              <button style={S.closeBtn} onClick={() => setPanelVisible(false)} aria-label="닫기">✕</button>
            </div>
            <div style={{ fontSize:12, color:'#313339', lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html: current.body }} />
            <div style={S.highlight}>{current.highlight}</div>
            <div style={S.chipRow}>
              {current.chips.map((chip) => (
                <button key={chip} style={S.chip} onClick={() => handleChipClick(chip)}>{chip} ↗</button>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={S.toastWrap}>
        <div style={S.toast(toastVisible)} onClick={handleToastClick} role="status" aria-live="polite">
          <div style={S.avatar} aria-hidden>
            <img
              src={HAI_AVATAR_SRC}
              alt=""
              width={28}
              height={28}
              decoding="async"
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ flex:1, lineHeight:1.35 }}>
            <div style={S.toastLabel}>H-AI 도움말</div>
            <div style={S.toastMsg}>{current?.msg ?? ''}</div>
          </div>
          <div style={S.toastArrow}>›</div>
        </div>
      </div>
    </>
  );
};

export default AgentToast;
