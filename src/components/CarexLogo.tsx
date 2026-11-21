import React, { useId } from 'react';

interface CarexLogoProps {
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: { width: 32, height: 24, text: 'text-base tracking-[0.18em]' },
  md: { width: 38, height: 28, text: 'text-lg tracking-[0.2em]' },
  lg: { width: 52, height: 38, text: 'text-2xl tracking-[0.22em]' },
};

export function CarexLogo({
  showWordmark = true,
  size = 'md',
  className = '',
}: CarexLogoProps) {
  const { width, height, text } = SIZE_MAP[size];
  const uid = useId().replace(/:/g, '');
  const silverGradId = `carexSilver_${uid}`;
  const xGradId = `carexElectricX_${uid}`;
  const orbitGradId = `carexOrbit_${uid}`;

  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 64 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={silverGradId} x1="10" y1="6" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="52%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id={xGradId} x1="25" y1="10" x2="54" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="48%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id={orbitGradId} x1="4" y1="38" x2="58" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="55%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
        </defs>

        {/* Metallic Silver C Emblem */}
        <path
          d="M36.5 11.5C33.8 8.8 30.1 7.2 26 7.2C17.4 7.2 10.5 14.1 10.5 22.8C10.5 31.4 17.4 38.4 26 38.4C30.2 38.4 34 36.7 36.7 34"
          stroke={`url(#${silverGradId})`}
          strokeWidth="6.2"
          strokeLinecap="butt"
        />

        {/* Interlocking Electric-Blue / Cyan X */}
        <path
          d="M27.5 12.2H35.2L41.4 20.6L47.8 12.2H55.2L45.1 24.4L55.6 36.8H47.6L41.2 28.2L34.7 36.8H27.2L37.4 24.4L27.5 12.2Z"
          fill={`url(#${xGradId})`}
        />

        {/* Sweeping Diagonal Orbital Swoosh */}
        <path
          d="M9.5 29.8C3.2 34.4 5.2 39.2 14.5 37.8C24.8 36.2 39.5 26.8 50.8 16.4C58.6 9.2 59.8 3.6 52.8 4.4C48.8 4.9 44.2 6.8 39.6 9.4"
          stroke={`url(#${orbitGradId})`}
          strokeWidth="2.3"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <span
          className={`font-display font-semibold text-white whitespace-nowrap shrink-0 ${text}`}
        >
          CARE
          <span className="bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            X
          </span>
        </span>
      )}
    </span>
  );
}
