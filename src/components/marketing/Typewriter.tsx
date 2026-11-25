import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap, ScrollTrigger } from '../../lib/gsap';

/**
 * Typewriter and reveal helpers, driven by GSAP and ScrollTrigger.
 *
 * Prerendered pages ship the full text, so search engines and no-JS visitors see everything.
 * Once React hydrates, the text is held back (`data-tw="pending"` keeps it hidden until then),
 * and typed in when it scrolls into view. The hidden part of the text keeps its space, so the
 * layout never moves while it types. Reduced motion shows the text as it is.
 */

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function textLength(node: React.ReactNode): number {
  let n = 0;
  React.Children.forEach(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') n += String(child).length;
    else if (React.isValidElement(child)) n += textLength((child.props as { children?: React.ReactNode }).children);
  });
  return n;
}

export function plainText(node: React.ReactNode): string {
  let s = '';
  React.Children.forEach(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') s += String(child);
    else if (React.isValidElement(child)) s += plainText((child.props as { children?: React.ReactNode }).children);
  });
  return s;
}

/**
 * Shows the first `shown` characters of a node and keeps the rest invisible but in place.
 * Elements inside the node (spans, links) keep their markup. The caret sits at the typing point.
 */
export function revealText(node: React.ReactNode, shown: number, caret = false): React.ReactNode {
  const cur = { i: 0, placed: false };
  const walk = (n: React.ReactNode): React.ReactNode =>
    React.Children.map(n, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        const s = String(child);
        const start = cur.i;
        cur.i += s.length;
        const k = clamp(shown - start, 0, s.length);
        const here = caret && !cur.placed && shown <= start + s.length;
        if (here) cur.placed = true;
        return (
          <>
            {s.slice(0, k)}
            {here && <span className="tw-caret" aria-hidden="true" />}
            {k < s.length && <span style={{ visibility: 'hidden' }}>{s.slice(k)}</span>}
          </>
        );
      }
      if (React.isValidElement(child)) {
        const kids = (child.props as { children?: React.ReactNode }).children;
        return kids == null ? child : React.cloneElement(child, undefined, walk(kids));
      }
      return child;
    });
  return walk(node);
}

type TypeOptions = {
  total: number;
  /** characters per second */
  cps?: number;
  /** seconds to wait before the first character */
  delay?: number;
  /** 'load' types straight away, 'view' waits for the element to scroll into view */
  trigger?: 'load' | 'view';
  start?: string;
};

export function useTypewriter({ total, cps = 40, delay = 0, trigger = 'view', start = 'top 88%' }: TypeOptions) {
  const ref = useRef<any>(null);
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(total);
  const [armed, setArmed] = useState(false);

  useIsoLayoutEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    if (reduce || total === 0) {
      setShown(total);
      setArmed(true);
      return;
    }
    setShown(0);
    setArmed(true);

    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: total,
      duration: total / cps,
      delay,
      ease: 'none',
      paused: true,
      onUpdate: () => setShown(Math.floor(state.n + 0.001)),
      onComplete: () => setShown(total),
    });
    let st: ScrollTrigger | undefined;
    if (trigger === 'load') tween.play();
    else st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => tween.play() });

    return () => {
      st?.kill();
      tween.kill();
    };
  }, [reduce, total, cps, delay, trigger, start]);

  return { ref, shown, armed, typing: armed && shown < total };
}

/** Fades and lifts its content in, on load or when it scrolls into view. */
export function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  trigger = 'view',
  start = 'top 90%',
  y = 18,
}: {
  as?: 'div' | 'p' | 'span';
  children: React.ReactNode;
  className?: string;
  delay?: number;
  trigger?: 'load' | 'view';
  start?: string;
  y?: number;
}) {
  const ref = useRef<any>(null);
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);

  useIsoLayoutEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    if (reduce) {
      setArmed(true);
      return;
    }
    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration: 0.9, delay, ease: 'power3.out', paused: true, clearProps: 'transform,opacity,visibility' },
    );
    setArmed(true);
    let st: ScrollTrigger | undefined;
    if (trigger === 'load') tween.play();
    else st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => tween.play() });
    return () => {
      st?.kill();
      tween.kill();
      gsap.set(el, { clearProps: 'transform,opacity,visibility' });
    };
  }, [reduce, delay, trigger, start, y]);

  const T = Tag as React.ElementType;
  return (
    <T ref={ref} className={className} data-gs={armed ? 'on' : 'pending'}>
      {children}
    </T>
  );
}

/** A number that counts up to its value when it scrolls into view. Holds its width while it counts. */
export function CountUp({ to, duration = 1.6, className }: { to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [value, setValue] = useState(to);
  const [armed, setArmed] = useState(false);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setArmed(true);
      return;
    }
    setValue(0);
    setArmed(true);
    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: to,
      duration,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => setValue(Math.round(state.v)),
      onComplete: () => setValue(to),
    });
    const st = ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => tween.play() });
    return () => {
      st.kill();
      tween.kill();
    };
  }, [reduce, to, duration]);

  return (
    <span ref={ref} className={`relative inline-block tabular-nums ${className ?? ''}`} data-gs={armed ? 'on' : 'pending'}>
      <span className="invisible">{to}</span>
      <span className="absolute left-0 top-0">{value}</span>
    </span>
  );
}
