import React, { useId } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  size?: number;
  animated?: boolean;
  className?: string;
}

/**
 * Animated 3D-shaded floating robot mascot SVG.
 * Features gentle hover bobbing, natural eye blinks, antenna sway,
 * pulsing chest/thruster glow, and a friendly wave on parent `.group` hover.
 */
export default function AnimatedChatIcon({ size = 46, animated = true, className }: Props) {
  const rawId = useId();
  const safeId = rawId.replace(/:/g, '');
  const metalHeadId = `rr-bot-head-${safeId}`;
  const metalBodyId = `rr-bot-body-${safeId}`;
  const metalArmLId = `rr-bot-arm-l-${safeId}`;
  const metalArmRId = `rr-bot-arm-r-${safeId}`;
  const visorId = `rr-bot-visor-${safeId}`;
  const orbBaseId = `rr-bot-orb-${safeId}`;
  const glowId = `rr-bot-glow-${safeId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={cn('select-none overflow-visible', animated && 'chatbot-robot-animated', className)}
      aria-hidden="true"
    >
      <defs>
        {/* 3D metallic steel-blue to ice-blue gradients */}
        <linearGradient id={metalHeadId} x1="22%" y1="78%" x2="88%" y2="18%">
          <stop offset="0%" stopColor="#3B6987" />
          <stop offset="45%" stopColor="#6B98B6" />
          <stop offset="82%" stopColor="#AED1F2" />
          <stop offset="100%" stopColor="#CBE4FD" />
        </linearGradient>

        <linearGradient id={metalBodyId} x1="20%" y1="80%" x2="85%" y2="15%">
          <stop offset="0%" stopColor="#3E6E8C" />
          <stop offset="50%" stopColor="#709DBA" />
          <stop offset="100%" stopColor="#B8D8F6" />
        </linearGradient>

        <linearGradient id={metalArmLId} x1="80%" y1="20%" x2="15%" y2="88%">
          <stop offset="0%" stopColor="#427290" />
          <stop offset="55%" stopColor="#729FBC" />
          <stop offset="100%" stopColor="#B9D9F7" />
        </linearGradient>

        <linearGradient id={metalArmRId} x1="20%" y1="20%" x2="85%" y2="88%">
          <stop offset="0%" stopColor="#427290" />
          <stop offset="55%" stopColor="#729FBC" />
          <stop offset="100%" stopColor="#B9D9F7" />
        </linearGradient>

        <linearGradient id={visorId} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#094580" />
          <stop offset="100%" stopColor="#0B4F91" />
        </linearGradient>

        <linearGradient id={orbBaseId} x1="20%" y1="20%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#5683A1" />
          <stop offset="100%" stopColor="#A9CCE9" />
        </linearGradient>

        <filter id={glowId} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft ground shadow that shrinks/expands as the robot dances */}
      <ellipse
        cx="60"
        cy="112"
        rx="16"
        ry="3.2"
        fill="rgba(11, 72, 132, 0.14)"
        className={animated ? 'chatbot-robot-shadow' : undefined}
      />

      {/* Main hovering/dancing character group */}
      <g className={animated ? 'chatbot-robot-float' : undefined}>
        {/* ── Hover thruster orb under torso ────────────────── */}
        <g>
          <ellipse cx="60" cy="100.8" rx="6.6" ry="5.6" fill={`url(#${orbBaseId})`} />
          <ellipse
            cx="60"
            cy="98.4"
            rx="4.8"
            ry="3.6"
            fill="#66FCFF"
            filter={`url(#${glowId})`}
            className={animated ? 'chatbot-robot-glow' : undefined}
          />
        </g>

        {/* ── Left floating arm ─────────────────────────────── */}
        <g className={animated ? 'chatbot-robot-arm-left' : undefined}>
          <path
            d="M42.8 76.2C44.8 78.2 42 85.8 37.8 90C34.2 93.6 30.1 92.8 29.6 89.6C29.1 86.2 34.1 79.8 38.6 76.3C40.1 75.1 41.7 75.1 42.8 76.2Z"
            fill={`url(#${metalArmLId})`}
          />
        </g>

        {/* ── Right floating arm (waves on hover) ───────────── */}
        <g className={animated ? 'chatbot-robot-arm-right' : undefined}>
          <path
            d="M77.2 76.2C75.2 78.2 78 85.8 82.2 90C85.8 93.6 89.9 92.8 90.4 89.6C90.9 86.2 85.9 79.8 81.4 76.3C79.9 75.1 78.3 75.1 77.2 76.2Z"
            fill={`url(#${metalArmRId})`}
          />
        </g>

        {/* ── Rounded torso + chest cyan badge ──────────────── */}
        <g>
          <path
            d="M60 75.4C70.2 75.4 74.2 78.6 73.6 85.2C73 92.6 67.8 99 60 99C52.2 99 47 92.6 46.4 85.2C45.8 78.6 49.8 75.4 60 75.4Z"
            fill={`url(#${metalBodyId})`}
          />
          <circle
            cx="66.6"
            cy="83.6"
            r="2.3"
            fill="#66FCFF"
            filter={`url(#${glowId})`}
            className={animated ? 'chatbot-robot-glow' : undefined}
          />
        </g>

        {/* ── Head assembly (subtle tilt) ───────────────────── */}
        <g className={animated ? 'chatbot-robot-head' : undefined}>
          {/* Left & right dark navy earpieces */}
          <ellipse cx="28.4" cy="49.5" rx="4.4" ry="7.2" fill="#0B4884" />
          <ellipse cx="91.6" cy="49.5" rx="4.4" ry="7.2" fill="#0B4884" />

          {/* Metallic rounded dome head */}
          <path
            d="M60 24C79.2 24 91.2 34.4 91.2 49.4C91.2 63.4 79.4 71.4 60 71.4C40.6 71.4 28.8 63.4 28.8 49.4C28.8 34.4 40.8 24 60 24Z"
            fill={`url(#${metalHeadId})`}
          />

          {/* Top-right antenna with blue socket */}
          <g className={animated ? 'chatbot-robot-antenna' : undefined}>
            <ellipse
              cx="76.5"
              cy="30.8"
              rx="2.5"
              ry="1.8"
              transform="rotate(26 76.5 30.8)"
              fill="#2B7DF4"
            />
            <line
              x1="76.6"
              y1="30.4"
              x2="85.2"
              y2="13.6"
              stroke="#5CFBFF"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter={`url(#${glowId})`}
            />
          </g>

          {/* Dark navy face visor */}
          <path
            d="M60 34.4C73.2 34.4 80.2 39.4 81.2 49C82.2 58.2 76.2 64.2 60 64.2C43.8 64.2 37.8 58.2 38.8 49C39.8 39.4 46.8 34.4 60 34.4Z"
            fill={`url(#${visorId})`}
          />

          {/* Glowing cyan oval eyes (blink naturally) */}
          <g filter={`url(#${glowId})`}>
            <ellipse
              cx="49.6"
              cy="48.5"
              rx="3.3"
              ry="5.4"
              fill="#68FCFF"
              className={animated ? 'chatbot-robot-eye' : undefined}
            />
            <ellipse
              cx="70.4"
              cy="48.5"
              rx="3.3"
              ry="5.4"
              fill="#68FCFF"
              className={animated ? 'chatbot-robot-eye' : undefined}
            />
          </g>

          {/* Happy friendly D-shaped smile */}
          <path
            d="M54.6 54.6H65.4C65.4 59.3 63 61.1 60 61.1C57 61.1 54.6 59.3 54.6 54.6Z"
            fill="#FFFFFF"
          />

          {/* Cyan headset mic wrapping from right ear */}
          <path
            d="M92.4 49.4C92 58.4 85.4 64.2 73.2 64.8"
            fill="none"
            stroke="#5CFBFF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <rect
            x="65.6"
            y="62.4"
            width="9.4"
            height="4.6"
            rx="2.3"
            fill="#66FCFF"
            filter={`url(#${glowId})`}
          />
        </g>
      </g>
    </svg>
  );
}
