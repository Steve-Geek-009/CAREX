import test from 'node:test';
import assert from 'node:assert/strict';
import { getStatusAppearance, resolveStatusVariant } from './status';

test('maps verified and active statuses to CAREX Cyan variant', () => {
  assert.equal(resolveStatusVariant('Active'), 'cyan');
  assert.equal(resolveStatusVariant('Verified'), 'cyan');
  assert.equal(resolveStatusVariant('Verified (Placeholder)'), 'cyan');
  assert.equal(resolveStatusVariant('Recorded'), 'cyan');
});

test('maps pending and review statuses to CAREX Electric Blue variant', () => {
  assert.equal(resolveStatusVariant('Pending'), 'electric');
  assert.equal(resolveStatusVariant('Pending Signature'), 'electric');
  assert.equal(resolveStatusVariant('Under Review'), 'electric');
  assert.equal(resolveStatusVariant('Not Submitted'), 'electric');
});

test('maps restricted, rejected, blocked, and revoked statuses to danger variant', () => {
  assert.equal(resolveStatusVariant('Rejected'), 'danger');
  assert.equal(resolveStatusVariant('Restricted'), 'danger');
  assert.equal(resolveStatusVariant('Blocked'), 'danger');
  assert.equal(resolveStatusVariant('Revoked'), 'danger');
});

test('maps unlinked or unknown statuses to metallic silver variant and allows explicit override', () => {
  assert.equal(resolveStatusVariant('Unlinked'), 'silver');
  assert.equal(resolveStatusVariant('No Wallet Connected'), 'silver');
  const appearance = getStatusAppearance('Custom State', 'cyan');
  assert.equal(appearance.variant, 'cyan');
  assert.equal(appearance.label, 'Custom State');
  assert.ok(appearance.containerClass.includes('cyan'));
});
