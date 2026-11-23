import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canAccessAccountRead,
  canAccessPortal,
  canMutateAccount,
  canPerformAdminAction,
  getAccountStatusLabel,
  getRoleLabel,
  normalizeAccountStatus,
  normalizeUserRole,
} from './rbac.ts';

test('blocks unauthenticated visitors and CLIENT users from administrative portal', () => {
  assert.equal(canAccessPortal(null, 'admin', 'ACTIVE'), false);
  assert.equal(canAccessPortal('CLIENT', 'admin', 'ACTIVE'), false);
  assert.equal(canPerformAdminAction('CLIENT', 'manage_users', 'ACTIVE'), false);
  assert.equal(canPerformAdminAction('CLIENT', 'restrict_accounts', 'ACTIVE'), false);
  assert.equal(canPerformAdminAction(null, 'view_dashboard', 'ACTIVE'), false);
});

test('enforces ACTIVE, UNDER_REVIEW (read-only), and RESTRICTED (blocked) account status policies', () => {
  assert.equal(canAccessAccountRead('ACTIVE'), true);
  assert.equal(canMutateAccount('ACTIVE'), true);

  assert.equal(canAccessAccountRead('UNDER_REVIEW'), true);
  assert.equal(canMutateAccount('UNDER_REVIEW'), false);
  assert.equal(canAccessPortal('CLIENT', 'client', 'UNDER_REVIEW'), true);
  assert.equal(canAccessPortal('ADMIN', 'admin', 'UNDER_REVIEW'), false);

  assert.equal(canAccessAccountRead('RESTRICTED'), false);
  assert.equal(canMutateAccount('RESTRICTED'), false);
  assert.equal(canAccessPortal('CLIENT', 'client', 'RESTRICTED'), false);
  assert.equal(canAccessPortal('ADMIN', 'admin', 'RESTRICTED'), false);
  assert.equal(canPerformAdminAction('ADMIN', 'manage_users', 'RESTRICTED'), false);
});

test('permits ACTIVE ADMIN users to access admin portal and perform admin actions', () => {
  assert.equal(canAccessPortal(null, 'public', null), true);
  assert.equal(canAccessPortal('CLIENT', 'client', 'ACTIVE'), true);
  assert.equal(canAccessPortal('ADMIN', 'admin', 'ACTIVE'), true);
  assert.equal(canPerformAdminAction('ADMIN', 'restrict_accounts', 'ACTIVE'), true);
  assert.equal(canPerformAdminAction('ADMIN', 'view_activity_logs', 'ACTIVE'), true);
});

test('normalizes roles and statuses safely without privilege escalation', () => {
  assert.equal(normalizeUserRole('admin'), 'ADMIN');
  assert.equal(normalizeUserRole('ADMIN'), 'ADMIN');
  assert.equal(normalizeUserRole('client'), 'CLIENT');
  assert.equal(normalizeUserRole('superadmin'), 'CLIENT');
  assert.equal(normalizeUserRole(undefined), 'CLIENT');

  assert.equal(normalizeAccountStatus('Active'), 'ACTIVE');
  assert.equal(normalizeAccountStatus('Under Review'), 'UNDER_REVIEW');
  assert.equal(normalizeAccountStatus('UNDER_REVIEW'), 'UNDER_REVIEW');
  assert.equal(normalizeAccountStatus('Restricted'), 'RESTRICTED');

  assert.equal(getRoleLabel('CLIENT'), 'Client User');
  assert.equal(getRoleLabel('ADMIN'), 'Platform Administrator');
  assert.equal(getAccountStatusLabel('UNDER_REVIEW'), 'Under Review');
});
