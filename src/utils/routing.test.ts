import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROUTES,
  getRoutesByPortal,
  isKnownRoute,
  normalizePath,
  resolveRoute,
} from './routing';

test('defines all 20 required pages across public, client, and admin portals', () => {
  assert.equal(ROUTES.length, 20);
  assert.equal(getRoutesByPortal('public').length, 8);
  assert.equal(getRoutesByPortal('client').length, 6);
  assert.equal(getRoutesByPortal('admin').length, 6);
});

test('normalizes trailing slashes, queries, hashes, and aliases', () => {
  assert.equal(normalizePath('/about/'), '/about');
  assert.equal(normalizePath('/client/dashboard?tab=1'), '/client');
  assert.equal(normalizePath('/admin/dashboard#top'), '/admin');
  assert.equal(normalizePath('/crx-token'), '/token');
  assert.equal(normalizePath('/docs'), '/documentation');
});

test('resolves known routes accurately and falls back cleanly on unknown routes', () => {
  const clientKyc = resolveRoute('/client/kyc');
  assert.equal(clientKyc.portal, 'client');
  assert.equal(clientKyc.label, 'KYC Verification');

  const adminLogs = resolveRoute('/admin/logs');
  assert.equal(adminLogs.portal, 'admin');
  assert.equal(adminLogs.label, 'Activity Logs');

  assert.equal(isKnownRoute('/client/transactions'), true);
  assert.equal(isKnownRoute('/non-existent-route'), false);
  assert.equal(resolveRoute('/non-existent-route').path, '/');
});
