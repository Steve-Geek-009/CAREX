import type { PortalArea } from './routing.ts';

export type UserRole = 'CLIENT' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'RESTRICTED';

export type AdminAction =
  | 'view_dashboard'
  | 'manage_users'
  | 'review_kyc'
  | 'manage_wallets'
  | 'restrict_accounts'
  | 'view_activity_logs';

const ROLE_LABELS: Record<UserRole, string> = {
  CLIENT: 'Client User',
  ADMIN: 'Platform Administrator',
};

const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  ACTIVE: 'Active',
  UNDER_REVIEW: 'Under Review',
  RESTRICTED: 'Restricted',
};

const ADMIN_ALLOWED_ACTIONS: Record<UserRole, readonly AdminAction[]> = {
  CLIENT: [],
  ADMIN: [
    'view_dashboard',
    'manage_users',
    'review_kyc',
    'manage_wallets',
    'restrict_accounts',
    'view_activity_logs',
  ],
};

export function normalizeUserRole(raw: unknown): UserRole {
  const value = typeof raw === 'string' ? raw.trim().toUpperCase() : '';
  return value === 'ADMIN' ? 'ADMIN' : 'CLIENT';
}

export function normalizeAccountStatus(raw: unknown): AccountStatus {
  const value =
    typeof raw === 'string' ? raw.trim().toUpperCase().replace(/\s+/g, '_') : '';
  if (value === 'RESTRICTED') return 'RESTRICTED';
  if (value === 'UNDER_REVIEW') return 'UNDER_REVIEW';
  return 'ACTIVE';
}

export function isValidAccountStatusInput(raw: unknown): raw is AccountStatus {
  return raw === 'ACTIVE' || raw === 'UNDER_REVIEW' || raw === 'RESTRICTED';
}

export function canAccessAccountRead(status: AccountStatus | null | undefined): boolean {
  return status === 'ACTIVE' || status === 'UNDER_REVIEW';
}

export function canMutateAccount(status: AccountStatus | null | undefined): boolean {
  return status === 'ACTIVE';
}

export function canAccessPortal(
  role: UserRole | null | undefined,
  portal: PortalArea,
  status: AccountStatus | null | undefined = 'ACTIVE'
): boolean {
  if (portal === 'public') {
    return true;
  }
  if (!role || !status || !canAccessAccountRead(status)) {
    return false;
  }
  if (portal === 'client') {
    return role === 'CLIENT' || role === 'ADMIN';
  }
  if (portal === 'admin') {
    return role === 'ADMIN' && status === 'ACTIVE';
  }
  return false;
}

export function canPerformAdminAction(
  role: UserRole | null | undefined,
  action: AdminAction,
  status: AccountStatus | null | undefined = 'ACTIVE'
): boolean {
  if (role !== 'ADMIN' || status !== 'ACTIVE') {
    return false;
  }
  return ADMIN_ALLOWED_ACTIONS[role].includes(action);
}

export function getRoleLabel(role: UserRole | null | undefined): string {
  if (!role) return 'Unauthenticated Visitor';
  return ROLE_LABELS[role] ?? 'Client User';
}

export function getAccountStatusLabel(status: AccountStatus | string): string {
  const normalized = normalizeAccountStatus(status);
  return ACCOUNT_STATUS_LABELS[normalized];
}
