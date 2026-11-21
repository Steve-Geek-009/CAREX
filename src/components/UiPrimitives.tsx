import React from 'react';
import { AppLink } from './AppLink';

type SemanticTone = 'neutral' | 'info' | 'positive' | 'warning' | 'danger';

const TONE_TEXT_MAP: Record<SemanticTone, string> = {
  neutral: 'text-slate-300',
  info: 'text-sky-300',
  positive: 'text-emerald-400',
  warning: 'text-amber-300',
  danger: 'text-rose-400',
};

export function StatusText({
  label,
  tone = 'neutral',
  className = '',
}: {
  label: string;
  tone?: SemanticTone;
  className?: string;
}) {
  return (
    <span className={`text-sm font-medium whitespace-nowrap ${TONE_TEXT_MAP[tone]} ${className}`}>
      {label}
    </span>
  );
}

export function StageNotice({
  title,
  description,
  actionLabel,
  actionTo,
  className = '',
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={`flex flex-col gap-3 rounded-xl border border-slate-800/90 bg-[#081124] px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      {actionLabel && actionTo && (
        <AppLink
          to={actionTo}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-700/90 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-blue-500/70 hover:text-white whitespace-nowrap"
        >
          {actionLabel}
        </AppLink>
      )}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start';
  return (
    <div className={`flex max-w-3xl flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <p className="text-sm font-medium text-sky-400">{eyebrow}</p>
      )}
      <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-slate-300">
          {description}
        </p>
      )}
    </div>
  );
}

export function EmptyStatePanel({
  title,
  description,
  metaNote,
  actionLabel,
  actionTo,
  onAction,
}: {
  title: string;
  description: string;
  metaNote?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-start justify-center rounded-xl border border-slate-800/90 bg-[#081124] px-6 py-10 sm:px-8 sm:py-12">
      <p className="font-display text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{description}</p>
      {metaNote && (
        <p className="mt-3 text-xs text-slate-500">{metaNote}</p>
      )}
      {actionLabel && actionTo && (
        <AppLink
          to={actionTo}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
        >
          {actionLabel}
        </AppLink>
      )}
      {actionLabel && onAction && !actionTo && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export interface SegmentedOption {
  value: string;
  label: string;
}

export function SegmentedTabs({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly SegmentedOption[];
  value: string;
  onChange: (nextValue: string) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-800/90 bg-[#060d1d] p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              active
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function KeyValueRow({
  label,
  value,
  mono = false,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: SemanticTone;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-800/70 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`text-sm font-medium ${TONE_TEXT_MAP[tone]} ${
          mono ? 'font-mono tabular-nums text-[13px]' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}
