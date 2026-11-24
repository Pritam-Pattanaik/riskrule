import React from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ElementType;
  rightElement?: React.ReactNode;
}

/**
 * Text field. Focus styling is pure CSS (focus-within), so typing never re-renders the wrapper
 * and the border, ring and icon change together in one 150ms step.
 */
export function Input({ label, error, hint, leftIcon: Icon, rightElement, className, id: userProvidedId, ...props }: InputProps) {
  const fallbackId = React.useId();
  const id = userProvidedId || fallbackId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className={cn('text-[13px] font-semibold leading-none', error ? 'text-danger' : 'text-primary')}>
          {label}
        </label>
      )}
      <div className="group relative">
        {Icon && (
          <div
            className={cn(
              'pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 transition-colors duration-150',
              error ? 'text-danger' : 'text-tertiary group-focus-within:text-accent'
            )}
          >
            <Icon size={16} strokeWidth={2} />
          </div>
        )}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-required={props.required}
          className={cn(
            'h-11 w-full rounded-xl border bg-surface text-[14px] font-medium text-primary outline-none',
            'placeholder:font-normal placeholder:text-muted',
            'border-primary/15 transition-[border-color,box-shadow,background-color] duration-150 hover:border-primary/30',
            'focus:border-accent focus:shadow-[0_0_0_3px_rgb(var(--color-accent)/0.18)]',
            'disabled:cursor-not-allowed disabled:bg-surface-1 disabled:opacity-60',
            error && 'border-danger/60 hover:border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgb(var(--color-danger)/0.15)]',
            Icon ? 'pl-10' : 'px-4',
            rightElement ? 'pr-12' : 'pr-4',
            className
          )}
          {...props}
        />
        {rightElement && <div className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center">{rightElement}</div>}
      </div>
      {error ? (
        <p id={errorId} className="animate-in text-[12.5px] font-medium leading-4 text-danger">{error}</p>
      ) : hint ? (
        <p id={hintId} className="text-[12.5px] leading-4 text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
}
