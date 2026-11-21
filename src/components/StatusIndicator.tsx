import React from 'react';
import { getStatusAppearance, type StatusVariant } from '../utils/status';

export interface StatusIndicatorProps {
  status: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusIndicator({
  status,
  variant,
  size = 'sm',
  className = '',
}: StatusIndicatorProps) {
  const appearance = getStatusAppearance(status, variant);
  const sizeClass =
    size === 'md'
      ? 'px-2.5 py-1 text-xs gap-2'
      : 'px-2 py-0.5 text-[11px] gap-1.5';

  return (
    <span
      data-status-variant={appearance.variant}
      className={`inline-flex items-center rounded-md border font-medium leading-tight tracking-[0.01em] whitespace-nowrap shrink-0 ${sizeClass} ${appearance.containerClass} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rotate-45 rounded-[1px] shrink-0 ${appearance.markerClass}`}
      />
      <span>{appearance.label}</span>
    </span>
  );
}
