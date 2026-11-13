import React from 'react';

interface OfficialLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'badge';
  alt?: string;
  light?: boolean;
}

// Official conference branding is shipped with each deployment, not stored in the browser.
export const OfficialLogo: React.FC<OfficialLogoProps> = ({ className = '', size = 'md', alt = 'IRCBM 2026 official conference logo', light = false }) => {
  const widths = { sm: 'w-28 sm:w-36', md: 'w-36 sm:w-48 md:w-56', lg: 'w-52 sm:w-72', badge: 'w-56 max-w-full' };
  return <img src="/ircbm-2026-official.png" alt={alt} className={`${widths[size]} h-auto max-w-full object-contain shrink-0 ${light ? 'brightness-0 invert' : ''} ${className}`} />;
};
