import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/cn';
import AnimatedChatIcon from './AnimatedChatIcon';
import type { ChatMessage as Msg } from './useChatbot';

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

interface Props {
  message: Msg;
}

export default function ChatMessage({ message }: Props) {
  const isBot = message.role === 'bot';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }).catch(() => {});
  };

  return (
    <div
      className={cn('group flex gap-3 px-1', isBot ? 'items-end' : 'flex-row-reverse items-end')}
    >
      {/* Avatar */}
      {isBot && (
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sky-200/70 bg-white shadow-xs"
          aria-hidden="true"
        >
          <AnimatedChatIcon size={24} animated={false} />
        </span>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'relative max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed',
          isBot
            ? 'rounded-bl-md border border-white/10 bg-white/[0.06] text-slate-200'
            : 'rounded-br-md bg-[var(--brand-green)] font-medium text-[#0F172A]',
        )}
      >
        {isBot ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) =>
                href?.startsWith('/') ? (
                  <Link
                    to={href}
                    className="font-medium text-[var(--brand-green)] underline decoration-[var(--brand-green)]/40 underline-offset-2 transition-colors hover:text-white"
                  >
                    {children}
                  </Link>
                ) : (
                  <a
                    href={href}
                    className="font-medium text-[var(--brand-green)] underline decoration-[var(--brand-green)]/40 underline-offset-2 transition-colors hover:text-white"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-0.5 last:mb-0">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-0.5 last:mb-0">{children}</ol>,
              li: ({ children }) => <li className="text-[13px] leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
              code: ({ children }) => (
                <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11.5px] text-[#5CFBFF]">
                  {children}
                </code>
              ),
              table: ({ children }) => (
                <div className="my-2 overflow-x-auto rounded-lg border border-white/10">
                  <table className="w-full text-[12px]">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="border-b border-white/10 bg-white/[0.04]">{children}</thead>,
              th: ({ children }) => <th className="px-2.5 py-1.5 text-left font-semibold text-white">{children}</th>,
              td: ({ children }) => <td className="px-2.5 py-1.5 text-slate-300">{children}</td>,
              h1: ({ children }) => <h4 className="mb-1.5 mt-2 font-semibold text-white">{children}</h4>,
              h2: ({ children }) => <h4 className="mb-1.5 mt-2 font-semibold text-white">{children}</h4>,
              h3: ({ children }) => <h4 className="mb-1 mt-1.5 font-semibold text-white">{children}</h4>,
            }}
          >
            {message.text}
          </ReactMarkdown>
        ) : (
          <span>{message.text}</span>
        )}

        {/* Footer row: timestamp + optional AI indicator + copy button */}
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className={cn('flex items-center gap-1.5 text-[10px]', isBot ? 'text-slate-500' : 'text-[#0F172A]/60')}>
            <span>{timeAgo(message.timestamp)}</span>
            {isBot && message.source === 'ai' && (
              <span className="rounded bg-cyan-400/15 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-[#5CFBFF]">
                AI
              </span>
            )}
          </p>

          {isBot && message.id !== 'greeting' && (
            <button
              type="button"
              onClick={handleCopy}
              className="rounded p-0.5 text-slate-500 opacity-0 transition-opacity hover:text-slate-200 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-green)]"
              aria-label={copied ? 'Copied' : 'Copy answer'}
              title={copied ? 'Copied!' : 'Copy answer'}
            >
              {copied ? <Check size={11} className="text-[var(--brand-green)]" /> : <Copy size={11} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
