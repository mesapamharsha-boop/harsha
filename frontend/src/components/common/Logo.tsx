import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtext?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtext = true,
  className = '',
  onClick,
}) => {
  const imageHeights = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-13',
    xl: 'h-15 sm:h-17',
  };

  const textSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[10px] sm:text-[11px] tracking-[0.28em]',
    lg: 'text-[12px] sm:text-[13px] tracking-[0.32em]',
    xl: 'text-[14px] sm:text-[15px] tracking-[0.35em]',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none cursor-pointer group leading-none ${className}`}
      id="leox-brand-anchor"
    >
      {/* Provided LEOX logo asset unchanged - no symbols, icons, or text in front */}
      <img
        src="/assets/leox-logo.png"
        alt="LEOX"
        className={`${imageHeights[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.endsWith('.svg')) {
            target.src = '/assets/leox.png';
          }
        }}
      />
      {/* Only “shoots” in small lowercase letters directly below the logo */}
      {/* {showSubtext && (
        <span
          className={`font-sans lowercase font-medium text-gray-400 -mt-1 group-hover:text-gray-200 transition-colors ${textSizes[size]}`}
          style={{ textTransform: 'lowercase' }}
        >
          shoots
        </span>
      )} */}
    </div>
  );
};
