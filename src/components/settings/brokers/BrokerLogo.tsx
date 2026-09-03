import React from 'react';
import { cn } from '../../../lib/cn';

// Import all broker SVG logos
import angeloneLogo from '../../../assets/brokers/angelone.svg';
import dhanLogo from '../../../assets/brokers/dhan.svg';
import zerodhaLogo from '../../../assets/brokers/zerodha.svg';
import deltaExchangeLogo from '../../../assets/brokers/delta_exchange.svg';
import upstoxLogo from '../../../assets/brokers/upstox.svg';
import growwLogo from '../../../assets/brokers/groww.svg';
import fivePaisaLogo from '../../../assets/brokers/5paisa.svg';
import bullforceLogo from '../../../assets/brokers/bullforce.svg';

const LOGO_MAP: Record<string, string> = {
  angelone: angeloneLogo,
  dhan: dhanLogo,
  zerodha: zerodhaLogo,
  delta_exchange: deltaExchangeLogo,
  upstox: upstoxLogo,
  groww: growwLogo,
  '5paisa': fivePaisaLogo,
  bullforce: bullforceLogo,
};

interface BrokerLogoProps {
  providerId: string;
  /** Fallback 2-letter text if no SVG exists */
  fallbackText?: string;
  themeColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** Apply grayscale filter (for Coming Soon) */
  muted?: boolean;
}

const SIZE_MAP = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

export const BrokerLogo: React.FC<BrokerLogoProps> = ({
  providerId,
  fallbackText,
  themeColor,
  size = 'md',
  className,
  muted = false,
}) => {
  const logoSrc = LOGO_MAP[providerId];
  const sizeClass = SIZE_MAP[size];

  if (logoSrc) {
    return (
      <div
        className={cn(
          sizeClass,
          'rounded-xl flex items-center justify-center overflow-hidden shrink-0 select-none',
          muted && 'opacity-50 grayscale',
          className
        )}
      >
        <img
          src={logoSrc}
          alt={`${providerId} logo`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    );
  }

  // Fallback to text initials
  return (
    <div
      className={cn(
        sizeClass,
        'rounded-xl flex items-center justify-center font-display font-black text-white shrink-0 select-none shadow-sm',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-xl',
        size === 'xl' && 'text-2xl',
        muted && 'opacity-50 grayscale',
        className
      )}
      style={{ backgroundColor: themeColor || '#6366F1' }}
    >
      {fallbackText || providerId.slice(0, 2).toUpperCase()}
    </div>
  );
};
