import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessPortal, canPerformAdminAction, getRoleLabel } from './rbac';

test('blocks ordinary client users and guests from administrative portal', () => {
  assert.equal(canAccessPortal('guest', 'admin'), false);
  assert.equal(canAccessPortal('client', 'admin'), false);
  assert.equal(canPerformAdminAction('client', 'manage_users'), false);
  assert.equal(canPerformAdminAction('client', 'restrict_accounts'), false);
  assert.equal(canPerformAdminAction('guest', 'view_dashboard'), false);
});

test('permits authorized roles to access designated portals and actions', () => {
  assert.equal(canAccessPortal('guest', 'public'), true);
  assert.equal(canAccessPortal('client', 'client'), true);
  assert.equal(canAccessPortal('admin', 'admin'), true);
  assert.equal(canPerformAdminAction('admin', 'restrict_accounts'), true);
  assert.equal(canPerformAdminAction('compliance_reviewer', 'review_kyc'), true);
  assert.equal(canPerformAdminAction('compliance_reviewer', 'restrict_accounts'), false);
});

test('returns human-readable labels for all roles', () => {
  assert.equal(getRoleLabel('client'), 'Standard Client User');
  assert.equal(getRoleLabel('admin'), 'Platform Administrator');
});
