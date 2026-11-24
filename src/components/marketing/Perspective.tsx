import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '../../lib/cn';
import { gsap } from '../../lib/gsap';
import { plainText, revealText, textLength, useIsoLayoutEffect, useTypewriter } from './Typewriter';

/**
 * Perspective typography for the marketing site.
 *
 *  ExtrudedText   headline built from stacked copies, so it has real thickness once it tilts
 *  TiltStage      tilts its children in 3D toward the pointer (a slow sway on touch screens)
 *  TypedHeading   heading that types itself out, on load or when it scrolls into view
 *  UnfoldHeading  TypedHeading that also folds up from a flat plane as it scrolls (GSAP ScrollTrigger)
 *  ScrollPlane    any block that swings from an angle to flat as it scrolls (GSAP ScrollTrigger)
 *
 * Everything falls back to flat, static content when the viewer prefers reduced motion.
 */

type Tone = 'light' | 'ink';

const tones: Record<Tone, { front: string; back: string }> = {
  light: { front: 'rgb(var(--color-text-primary))', back: 'rgb(var(--color-canvas))' },
  ink: { front: '#F8FAFC', back: '#0F172A' },
};

/** Text with depth. The copies sit directly behind the front face, so they only show once something tilts it. */
export function ExtrudedText({
  children,
  front: frontFace,
  layers = 14,
  step = 3,
  tone = 'light',
  className,
}: {
  children: React.ReactNode;
  /** What the front face shows, when it differs from the stacked copies (the typing caret). */
  front?: React.ReactNode;
  layers?: number;
  step?: number;
  tone?: Tone;
  className?: string;
}) {
  const { front, back } = tones[tone];
  return (
    <span className={cn('relative block [transform-style:preserve-3d]', className)}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 block select-none [transform-style:preserve-3d]">
        {Array.from({ length: layers }).map((_, i) => {
          const strength = Math.round(62 - (i / layers) * 54); // fades toward the back
          return (
            <span
              key={i}
              className="absolute inset-0 block"
              style={{
                transform: `translateZ(${-(i + 1) * step}px)`,
                color: `color-mix(in srgb, ${front} ${strength}%, ${back})`,
              }}
            >
              {children}
            </span>
          );
        })}
      </span>
      <span className="relative block">{frontFace ?? children}</span>
    </span>
  );
}

/** Tilts toward the pointer. On touch screens, where there is no pointer, it sways on its own. */
export function TiltStage({
  children,
  className,
  rest = { x: 4, y: -7 },
  range = { x: 5, y: 9 },
  perspective = 1300,
  origin = '50% 50%',
}: {
  children: React.ReactNode;
  className?: string;
  rest?: { x: number; y: number };
  range?: { x: number; y: number };
  perspective?: number;
  origin?: string;
}) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(rest.x);
  const ry = useMotionValue(rest.y);
  const sx = useSpring(rx, { stiffness: 80, damping: 17, mass: 0.6 });
  const sy = useSpring(ry, { stiffness: 80, damping: 17, mass: 0.6 });
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia('(hover: none)').matches) {
      setTouch(true);
      return;
    }
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ry.set(rest.y + nx * range.y * 2);
      rx.set(rest.x - ny * range.x * 2);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduce, rx, ry, rest.x, rest.y, range.x, range.y]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div className={className} style={{ perspective }}>
      <motion.div
        className={cn('[transform-style:preserve-3d]', touch && 'animate-sway')}
        style={touch ? { transformOrigin: origin } : { rotateX: sx, rotateY: sy, transformOrigin: origin }}
      >
        {children}
      </motion.div>
    </div>
  );
}

type Extrude = { tone?: Tone; layers?: number; step?: number };

/**
 * A heading that types itself out. The full text stays in the aria-label, so a screen reader
 * never hears a half-typed heading, and the hidden part keeps its space so nothing shifts.
 */
export function TypedHeading({
  as: Tag = 'h2',
  children,
  className,
  style,
  extrude,
  cps = 44,
  delay = 0,
  trigger = 'view',
  start = 'top 88%',
}: {
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  extrude?: Extrude;
  cps?: number;
  delay?: number;
  trigger?: 'load' | 'view';
  start?: string;
}) {
  const { ref, shown, armed, typing } = useTypewriter({ total: textLength(children), cps, delay, trigger, start });
  const T = Tag as React.ElementType;
  const body = extrude ? (
    <ExtrudedText {...extrude} front={revealText(children, shown, typing)}>
      {revealText(children, shown, false)}
    </ExtrudedText>
  ) : (
    revealText(children, shown, typing)
  );
  return (
    <T ref={ref} className={className} style={style} aria-label={plainText(children)} data-tw={armed ? 'on' : 'pending'}>
      {body}
    </T>
  );
}

/** Heading that folds up from the floor as it scrolls into view, then types. Stays readable at every point. */
export function UnfoldHeading({
  as = 'h2',
  children,
  className,
  style,
  cps = 46,
}: {
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  cps?: number;
}) {
  const trigger = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    if (reduce || !trigger.current || !plane.current) return;
    const el = plane.current;
    const tween = gsap.fromTo(
      el,
      { rotateX: 58, opacity: 0.25, y: 20, transformPerspective: 900, transformOrigin: '50% 100%' },
      {
        rotateX: 0,
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: trigger.current, start: 'top 94%', end: 'top 60%', scrub: 0.6 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: 'all' });
    };
  }, [reduce]);

  return (
    <div ref={trigger}>
      <div ref={plane}>
        <TypedHeading as={as} className={className} style={style} cps={cps} start="top 86%">
          {children}
        </TypedHeading>
      </div>
    </div>
  );
}

type From = { rotateX?: number; rotateY?: number; scale?: number; x?: number; y?: number };

/** A block that swings from an angle to flat as it scrolls into view. Scrubbed, so it follows the scroll smoothly. */
export function ScrollPlane({
  children,
  className,
  from = { rotateX: 24, scale: 0.94, y: 50 },
  start = 'top 100%',
  end = 'top 30%',
  origin = '50% 0%',
  perspective = 1500,
}: {
  children: React.ReactNode;
  className?: string;
  from?: From;
  start?: string;
  end?: string;
  origin?: string;
  perspective?: number;
}) {
  const trigger = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    if (reduce || !trigger.current || !plane.current) return;
    const el = plane.current;
    const tween = gsap.fromTo(
      el,
      {
        rotateX: from.rotateX ?? 0,
        rotateY: from.rotateY ?? 0,
        scale: from.scale ?? 1,
        x: from.x ?? 0,
        y: from.y ?? 0,
        transformPerspective: perspective,
        transformOrigin: origin,
      },
      {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        x: 0,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: trigger.current, start, end, scrub: 0.8 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: 'all' });
    };
  }, [reduce, start, end, origin, perspective]);

  return (
    <div ref={trigger} className={className}>
      <div ref={plane}>{children}</div>
    </div>
  );
}
