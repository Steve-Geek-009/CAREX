export type StatusVariant = 'cyan' | 'electric' | 'danger' | 'silver';

export interface StatusAppearance {
  variant: StatusVariant;
  containerClass: string;
  markerClass: string;
  label: string;
}

const CYAN_STATUSES = new Set([
  'active',
  'verified',
  'verified (placeholder)',
  'recorded',
  'linked',
  'linked (placeholder)',
  'connected',
  'approved',
  'completed',
]);

const ELECTRIC_STATUSES = new Set([
  'pending',
  'pending signature',
  'under review',
  'not submitted',
  'preview account (unverified)',
  'scheduled',
  'in progress',
  'stage 1 active',
]);

const DANGER_STATUSES = new Set([
  'rejected',
  'restricted',
  'revoked',
  'blocked',
  'suspended',
]);

export function resolveStatusVariant(status: string): StatusVariant {
  const normalized = status.trim().toLowerCase().replace(/_/g, ' ');
  if (CYAN_STATUSES.has(normalized)) {
    return 'cyan';
  }
  if (ELECTRIC_STATUSES.has(normalized)) {
    return 'electric';
  }
  if (DANGER_STATUSES.has(normalized)) {
    return 'danger';
  }
  if (normalized.includes('verified') || normalized.includes('active')) {
    return 'cyan';
  }
  if (normalized.includes('pending') || normalized.includes('review') || normalized.includes('stage')) {
    return 'electric';
  }
  if (normalized.includes('reject') || normalized.includes('restrict') || normalized.includes('block') || normalized.includes('revok')) {
    return 'danger';
  }
  return 'silver';
}

export function getStatusAppearance(status: string, explicitVariant?: StatusVariant): StatusAppearance {
  const variant = explicitVariant ?? resolveStatusVariant(status);

  switch (variant) {
    case 'cyan':
      return {
        variant,
        label: status,
        containerClass:
          'border-cyan-400/35 bg-cyan-500/10 text-cyan-200',
        markerClass: 'bg-cyan-400',
      };
    case 'electric':
      return {
        variant,
        label: status,
        containerClass:
          'border-blue-500/45 bg-blue-600/15 text-blue-200',
        markerClass: 'bg-blue-400',
      };
    case 'danger':
      return {
        variant,
        label: status,
        containerClass:
          'border-rose-500/40 bg-rose-500/10 text-rose-300',
        markerClass: 'bg-rose-400',
      };
    case 'silver':
    default:
      return {
        variant: 'silver',
        label: status,
        containerClass:
          'border-slate-700/90 bg-slate-800/45 text-slate-300',
        markerClass: 'bg-slate-400',
      };
  }
}
