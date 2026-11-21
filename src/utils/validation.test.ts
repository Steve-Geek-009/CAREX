import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluatePasswordStrength,
  filterRecords,
  validateLoginForm,
  validateProfileForm,
  validateRegisterForm,
} from './validation';

test('validates login form and rejects empty or malformed inputs', () => {
  const emptyErrors = validateLoginForm({ email: '', password: '' });
  assert.ok(emptyErrors.email);
  assert.ok(emptyErrors.password);

  const badEmail = validateLoginForm({ email: 'not-an-email', password: 'Password123' });
  assert.ok(badEmail.email);
  assert.equal(badEmail.password, undefined);

  const valid = validateLoginForm({ email: 'member@carex.example', password: 'Password123' });
  assert.deepEqual(valid, {});
});

test('validates registration form password strength, match, and terms acceptance', () => {
  const strengthWeak = evaluatePasswordStrength('short');
  assert.equal(strengthWeak.isValid, false);

  const strengthStrong = evaluatePasswordStrength('CarexSecure2026');
  assert.equal(strengthStrong.isValid, true);

  const mismatch = validateRegisterForm({
    fullName: 'Elena Vance',
    email: 'elena@carex.example',
    password: 'CarexSecure2026',
    confirmPassword: 'DifferentPassword1',
    acceptedTerms: false,
  });
  assert.ok(mismatch.confirmPassword);
  assert.ok(mismatch.acceptedTerms);

  const valid = validateRegisterForm({
    fullName: 'Elena Vance',
    email: 'elena@carex.example',
    password: 'CarexSecure2026',
    confirmPassword: 'CarexSecure2026',
    acceptedTerms: true,
  });
  assert.deepEqual(valid, {});
});

test('validates profile form and filters records by search query and status', () => {
  const invalidProfile = validateProfileForm({
    displayName: 'A',
    contactEmail: 'bad',
    jurisdiction: '',
  });
  assert.ok(invalidProfile.displayName);
  assert.ok(invalidProfile.contactEmail);
  assert.ok(invalidProfile.jurisdiction);

  const rows = [
    { id: '1', name: 'Placeholder User Alpha', status: 'Pending' },
    { id: '2', name: 'Placeholder User Beta', status: 'Verified' },
    { id: '3', name: 'Placeholder User Gamma', status: 'Rejected' },
  ];

  const byStatus = filterRecords(rows, '', ['name'], 'status', 'Verified');
  assert.equal(byStatus.length, 1);
  assert.equal(byStatus[0].id, '2');

  const byQuery = filterRecords(rows, 'gamma', ['name'], 'status', 'all');
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].id, '3');
});
