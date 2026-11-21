import type { PortalArea } from './routing';

export type UserRole = 'guest' | 'client' | 'compliance_reviewer' | 'admin';

export type AdminAction =
  | 'view_dashboard'
  | 'manage_users'
  | 'review_kyc'
  | 'manage_wallets'
  | 'restrict_accounts'
  | 'view_activity_logs';

const ROLE_LABELS: Record<UserRole, string> = {
  guest: 'Public Visitor',
  client: 'Standard Client User',
  compliance_reviewer: 'Compliance Reviewer',
  admin: 'Platform Administrator',
};

const ADMIN_ALLOWED_ACTIONS: Record<UserRole, readonly AdminAction[]> = {
  guest: [],
  client: [],
  compliance_reviewer: ['view_dashboard', 'review_kyc', 'view_activity_logs'],
  admin: [
    'view_dashboard',
    'manage_users',
    'review_kyc',
    'manage_wallets',
    'restrict_accounts',
    'view_activity_logs',
  ],
};

export function canAccessPortal(role: UserRole, portal: PortalArea): boolean {
  if (portal === 'public') {
    return true;
  }
  if (portal === 'client') {
    return role === 'client' || role === 'compliance_reviewer' || role === 'admin';
  }
  if (portal === 'admin') {
    return role === 'admin' || role === 'compliance_reviewer';
  }
  return false;
}

export function canPerformAdminAction(role: UserRole, action: AdminAction): boolean {
  return ADMIN_ALLOWED_ACTIONS[role].includes(action);
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}
