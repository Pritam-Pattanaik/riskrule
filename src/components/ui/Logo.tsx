import React from 'react';
import logoUrl from '../../assets/images/logo-primary.webp';

interface LogoProps {
  variant?: 'icon' | 'full' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  if (variant === 'wordmark') {
    return (
      <span className={`font-display font-bold tracking-tight text-primary ${textClasses[size]} ${className}`}>
        TradeVault
      </span>
    );
  }

  if (variant === 'icon') {
    return (
      <img
        src={logoUrl}
        alt="TradeVault Logo"
        className={`${sizeClasses[size]} object-contain drop-shadow-md ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoUrl}
        alt="TradeVault"
        className={`${sizeClasses[size]} object-contain drop-shadow-md shrink-0`}
      />
      <span className={`font-display font-bold tracking-tight text-primary ${textClasses[size]} leading-none`}>
        TradeVault
      </span>
    </div>
  );
};
