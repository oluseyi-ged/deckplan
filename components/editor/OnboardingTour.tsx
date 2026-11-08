'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { TOUR_STEPS, TOUR_STORAGE_KEY } from '@/lib/tourSteps';

type Rect = { top: number; left: number; width: number; height: number };

let restartListener: (() => void) | null = null;

export function restartTour() {
  restartListener?.();
}

const SPOTLIGHT_PADDING = 8;
const EXIT_MS = 200;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hasOnboarded(): boolean {
  try {
    return window.localStorage.getItem(TOUR_STORAGE_KEY) === '1';
  } catch {
    // localStorage unavailable; skip the tour rather than show it every load.
    return true;
  }
}

export default function OnboardingTour() {
  const [active, setActive] = useState(() => !hasOnboarded());
  const [closing, setClosing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const start = () => {
    setClosing(false);
    setStepIndex(0);
    setActive(true);
  };

  useEffect(() => {
    restartListener = start;
    return () => {
      restartListener = null;
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const measure = () => {
      const el = document.querySelector(TOUR_STEPS[stepIndex].target);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, stepIndex]);

  const close = () => {
    setClosing(true);
    try {
      window.localStorage.setItem(TOUR_STORAGE_KEY, '1');
    } catch {
      // best-effort; the Help button in the toolbar can always replay the tour.
    }
    setTimeout(() => setActive(false), EXIT_MS);
  };

  if (!active || !rect) return null;

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  const moveMs = prefersReducedMotion() ? 1 : 320;
  const tooltipPos = computeTooltipPosition(step.placement, rect, moveMs);

  return (
    <div
      className="fixed inset-0 z-[100] transition-opacity"
      style={{ opacity: closing ? 0 : 1, transitionDuration: `${EXIT_MS}ms`, transitionTimingFunction: 'var(--ease-out)' }}
    >
      <div className="absolute inset-0" onClick={close} />
      <div
        className="pointer-events-none absolute rounded-xl"
        style={{
          top: rect.top - SPOTLIGHT_PADDING,
          left: rect.left - SPOTLIGHT_PADDING,
          width: rect.width + SPOTLIGHT_PADDING * 2,
          height: rect.height + SPOTLIGHT_PADDING * 2,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)',
          transition: `top ${moveMs}ms var(--ease-in-out), left ${moveMs}ms var(--ease-in-out), width ${moveMs}ms var(--ease-in-out), height ${moveMs}ms var(--ease-in-out)`,
        }}
      />
      <div
        key={stepIndex}
        className="absolute w-72 animate-tour-in rounded-lg border border-neutral-700 bg-panel-raised p-4 shadow-2xl"
        style={tooltipPos}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close tour"
          className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-neutral-300"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <p className="pr-5 text-sm font-semibold text-neutral-100">{step.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-400">{step.body}</p>
        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1 w-1 rounded-full ${i === stepIndex ? 'bg-sky-500' : 'bg-neutral-700'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            {!isLast && (
              <button type="button" onClick={close} className="text-xs text-neutral-500 hover:text-neutral-300">
                Skip
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? close() : setStepIndex((i) => i + 1))}
              className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-500"
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TOOLTIP_WIDTH = 288;
const TOOLTIP_EST_HEIGHT = 170;
const EDGE_MARGIN = 16;

function computeTooltipPosition(
  placement: (typeof TOUR_STEPS)[number]['placement'],
  rect: Rect,
  moveMs: number
): React.CSSProperties {
  const GAP = 16;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const transition = `top ${moveMs}ms var(--ease-in-out), left ${moveMs}ms var(--ease-in-out)`;
  const clampTop = (top: number) =>
    Math.min(Math.max(top, EDGE_MARGIN), viewportHeight - TOOLTIP_EST_HEIGHT - EDGE_MARGIN);
  const clampLeft = (left: number) =>
    Math.min(Math.max(left, EDGE_MARGIN), viewportWidth - TOOLTIP_WIDTH - EDGE_MARGIN);

  if (placement === 'below') {
    return { top: clampTop(rect.top + rect.height + GAP), left: clampLeft(rect.left), transition };
  }
  if (placement === 'top-center') {
    return {
      top: clampTop(rect.top + 28),
      left: clampLeft(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2),
      transition,
    };
  }
  return {
    top: clampTop(rect.top + rect.height / 2 - TOOLTIP_EST_HEIGHT / 2),
    left: clampLeft(rect.left + rect.width + GAP),
    transition,
  };
}
