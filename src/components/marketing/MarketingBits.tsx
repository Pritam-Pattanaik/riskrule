import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { TypedHeading, UnfoldHeading } from './Perspective';
import { Reveal } from './Typewriter';

/**
 * Shared marketing building blocks. Colours come from the .landing tokens in index.css:
 * green #22C55E actions, #047857 links and gains, #B91C1C losses, slate text on #F8FAFC.
 */

export const container = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8';

const buttonBase =
  'inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 text-[15px] font-semibold ' +
  'transition-[background-color,box-shadow,transform,border-color] duration-150 outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.98]';

export const btnPrimary = cn(
  buttonBase,
  'bg-[var(--brand-action)] text-[color:var(--brand-action-text)] shadow-[0_1px_0_rgb(255_255_255/0.35)_inset,0_6px_18px_-6px_rgb(34_197_94/0.55)]',
  'hover:bg-[var(--brand-action-hover)] hover:shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_8px_22px_-6px_rgb(14_159_110/0.6)]',
);
export const btnSecondary = cn(
  buttonBase,
  'border border-primary/15 bg-surface text-primary shadow-xs hover:border-primary/30 hover:bg-surface-1',
);
/** For use on dark ink surfaces. */
export const btnOnInk = cn(
  buttonBase,
  'border border-white/15 text-white hover:border-white/30 hover:bg-white/5 focus-visible:ring-offset-[#0F172A]',
);
export const textLink =
  'inline-flex items-center gap-1.5 text-[15px] font-medium text-accent transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[4px]';

export const card = 'rounded-2xl border border-primary/10 bg-surface shadow-card';

/** Headline treatment shared by every page and section. */
export const h1Class =
  'font-display text-[42px] font-bold leading-[1.02] tracking-[-0.035em] text-primary sm:text-[58px] lg:text-[68px]';
export const h2Class =
  'font-display text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-primary sm:text-[42px]';
export const leadClass = 'text-[17px] leading-[1.65] text-secondary sm:text-[18px]';

/** Opens every section: a left-aligned title and one line of context. */
export function Section({
  id,
  title,
  lead,
  children,
  className,
  align = 'left',
}: {
  id?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}) {
  return (
    <section id={id} className={cn('scroll-mt-20 py-16 sm:py-24', className)}>
      <div className={container}>
        <header className={cn('mb-12 max-w-2xl', align === 'center' && 'mx-auto text-center')}>
          <UnfoldHeading className={h2Class} style={{ textWrap: 'balance' }}>{title}</UnfoldHeading>
          {lead && <Reveal as="p" delay={0.5} start="top 92%" className={cn(leadClass, 'mt-4')}>{lead}</Reveal>}
        </header>
        {children}
      </div>
    </section>
  );
}

/** Top of every inner page: headline, lead, actions. Kept compact so content starts above the fold. */
export function PageHero({
  title,
  lead,
  children,
  aside,
}: {
  title: string;
  lead: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-primary/10">
      <div className="hero-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className={cn(container, 'relative grid items-center gap-10 py-14 sm:py-20', aside && 'lg:grid-cols-[1.1fr_0.9fr] lg:gap-16')}>
        <div>
          <TypedHeading
            as="h1"
            trigger="load"
            delay={0.15}
            cps={46}
            className={cn(h1Class, 'max-w-3xl !text-[40px] !tracking-[-0.03em] sm:!text-[54px] lg:!text-[64px]')}
            style={{ textWrap: 'balance' }}
          >
            {title}
          </TypedHeading>
          <Reveal as="p" trigger="load" delay={0.7} className={cn(leadClass, 'mt-5 max-w-xl')}>{lead}</Reveal>
          {children && <Reveal trigger="load" delay={0.9} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">{children}</Reveal>}
        </div>
        {aside}
      </div>
    </section>
  );
}

/** Small honest label for illustrative data. */
export function SampleTag({ children = 'Sample data', onInk }: { children?: string; onInk?: boolean }) {
  return (
    <span className={cn('rounded-md border px-2 py-0.5 text-[11px] font-medium', onInk ? 'border-white/15 text-slate-400' : 'border-primary/10 text-tertiary')}>
      {children}
    </span>
  );
}

/** Icon tile used by feature lists. */
export function IconTile({ icon: Icon, tone = 'green' }: { icon: React.ElementType; tone?: 'green' | 'red' | 'ink' }) {
  return (
    <span
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl border',
        tone === 'green' && 'border-[var(--brand-green)]/25 bg-[var(--brand-green)]/10 text-accent',
        tone === 'red' && 'border-[var(--brand-red)]/25 bg-[var(--brand-red)]/10 text-danger',
        tone === 'ink' && 'border-primary/10 bg-primary text-inverse',
      )}
    >
      <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

/** Closing call to action used at the foot of inner pages. */
export function CtaBand({
  title = 'Find the trade that broke your day',
  lead = 'Connect a broker or log a trade by hand. The free plan needs no credit card.',
}: { title?: string; lead?: string }) {
  return (
    <section className="px-5 pb-16 sm:px-8 sm:pb-24" aria-label="Get started">
      <div className="ink relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl px-6 py-14 sm:px-14 sm:py-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--brand-green)]/20 blur-[90px]" aria-hidden="true" />
        <h2 className="relative max-w-2xl font-display text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-[44px]" style={{ textWrap: 'balance' }}>
          {title}
        </h2>
        <p className="relative mt-4 max-w-xl text-[17px] leading-7 text-slate-300">{lead}</p>
        <div className="relative mt-8 flex flex-wrap items-center gap-3">
          <Link to="/signup" className={btnPrimary}>Start free</Link>
          <Link to="/pricing" className={btnOnInk}>See pricing</Link>
        </div>
      </div>
    </section>
  );
}
