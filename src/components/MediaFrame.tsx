import React, { useState } from 'react';

interface MediaFrameProps {
  src: string;
  alt: string;
  aspectClass?: string;
  className?: string;
  scrimClassName?: string;
  fallbackTitle?: string;
  objectPosition?: string;
}

export function MediaFrame({
  src,
  alt,
  aspectClass = 'aspect-[16/9]',
  className = '',
  scrimClassName,
  fallbackTitle = 'CAREX Visual Architecture',
  objectPosition = 'object-center',
}: MediaFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#070f21] ${aspectClass} ${className}`}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${objectPosition}`}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#060d1f] via-[#0a1630] to-[#040814] p-8 text-center"
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
            className="mb-3 opacity-70"
          >
            <circle cx="32" cy="32" r="24" stroke="#3B82F6" strokeWidth="1.2" strokeOpacity="0.5" />
            <circle cx="32" cy="32" r="14" stroke="#22D3EE" strokeWidth="1.2" strokeOpacity="0.6" />
            <circle cx="32" cy="32" r="3" fill="#E2E8F0" />
          </svg>
          <span className="text-sm font-medium text-slate-300">{fallbackTitle}</span>
        </div>
      )}
      {scrimClassName && <div className={`pointer-events-none absolute inset-0 ${scrimClassName}`} />}
    </div>
  );
}
