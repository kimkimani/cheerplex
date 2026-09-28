import React from 'react';

interface CheerplexLogoProps {
  variant?: 'emblem' | 'full' | 'compact';
  size?: number | string;
  className?: string;
  showDomain?: boolean;
}

export default function CheerplexLogo({
  variant = 'emblem',
  size = 32,
  className = '',
  showDomain = true,
}: CheerplexLogoProps) {
  // Pure CP Emblem: Background in Cheerplex main color (#1d4ed8), text color white (#ffffff)
  const Emblem = (
    <svg
      viewBox="0 0 512 512"
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? size : undefined}
      className={`shrink-0 select-none ${typeof size === 'string' ? size : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cheerplex CP Logo"
    >
      {/* Background in main brand color (#1d4ed8) */}
      <rect width="512" height="512" rx="112" fill="#1d4ed8" />

      {/* Only CP - Pure White Text (#ffffff) */}
      {/* Letter C */}
      <path
        d="M 199 140 L 242 140 L 242 188 L 199 188 A 68 68 0 1 0 199 324 L 242 324 L 242 372 L 199 372 A 116 116 0 1 1 199 140 Z"
        fill="#ffffff"
      />

      {/* Letter P */}
      <path
        d="M 269 140 L 361 140 A 68 68 0 0 1 361 276 L 317 276 L 317 372 L 269 372 Z M 317 188 L 361 188 A 20 20 0 0 1 361 228 L 317 228 Z"
        fill="#ffffff"
        fillRule="evenodd"
      />
    </svg>
  );

  if (variant === 'emblem') {
    return Emblem;
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {Emblem}
      <div className="flex flex-col text-left">
        <span className="font-black text-lg sm:text-xl tracking-tight text-[var(--text)] font-display leading-tight flex items-baseline">
          CHEERPLEX
          {showDomain && (
            <span className="text-blue-600 dark:text-blue-400 font-mono text-xs font-bold ml-1">
              .KE
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
