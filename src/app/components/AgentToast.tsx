'use client';

import React, { useState, useEffect } from 'react';

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
  /** 목업: 스크롤 구간에 맞춰 토스트가 유지되므로 미사용 (API 호환용으로만 남김) */
  autoHideMs?: number;
}

const HAI_AVATAR_SRC = "/hai-travel-prep-fab.png";

function computeActiveToastKey(
  triggers: ScrollTrigger[],
  container: Window | HTMLElement,
): string | null {
  const isWin = container === window;
  const scrollTop = isWin ? window.scrollY : (container as HTMLElement).scrollTop;
  const clientHeight = isWin ? window.innerHeight : (container as HTMLElement).clientHeight;
  const lineY = scrollTop + clientHeight * 0.65;
  const containerTop = isWin ? 0 : (container as HTMLElement).getBoundingClientRect().top;
  let activeKey: string | null = null;
  for (const { sectionId, toastKey } of triggers) {
    const el = document.getElementById(sectionId);
    if (!el) continue;
    const elTop = el.getBoundingClientRect().top - containerTop + scrollTop;
    if (lineY > elTop) {
      activeKey = toastKey;
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
    borderRadius: 16,
    border: '1.5px solid #5E2BB8',
    padding: 16,
    zIndex: 200,
    boxShadow: '0 8px 32px rgba(94,43,184,0.18)',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: 'opacity 0.25s, transform 0.25s',
    pointerEvents: visible ? 'all' : 'none',
    margin: '0 12px 8px',
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
  toastData, triggers, scrollContainerRef,
}) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const panelVisibleRef = React.useRef(panelVisible);
  panelVisibleRef.current = panelVisible;
  const rafScrollRef = React.useRef<number | null>(null);

  useEffect(() => {
    const container = (scrollContainerRef?.current ?? window) as Window | HTMLElement;

    const syncToastFromScroll = () => {
      if (panelVisibleRef.current) return;
      const activeKey = computeActiveToastKey(triggers, container);
      setCurrentKey(activeKey);
      setToastVisible(activeKey != null);
    };

    const handleScroll = () => {
      if (rafScrollRef.current != null) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = null;
        syncToastFromScroll();
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    queueMicrotask(syncToastFromScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafScrollRef.current != null) {
        cancelAnimationFrame(rafScrollRef.current);
        rafScrollRef.current = null;
      }
    };
  }, [triggers, scrollContainerRef]);

  /** 상세 패널을 닫은 뒤 스크롤 없이도 현재 구간 토스트가 다시 보이도록 */
  useEffect(() => {
    if (panelVisible) return;
    const container = (scrollContainerRef?.current ?? window) as Window | HTMLElement;
    const activeKey = computeActiveToastKey(triggers, container);
    setCurrentKey(activeKey);
    setToastVisible(activeKey != null);
  }, [panelVisible, triggers, scrollContainerRef]);

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

  const handleToastClick = () => {
    if (!currentKey) return;
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
      <div style={S.panel(panelVisible)} aria-hidden={!panelVisible}>
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
