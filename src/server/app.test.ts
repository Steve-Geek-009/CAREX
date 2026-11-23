import test from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { createApiApp, type ServerDependencies } from './app.ts';
import {
  DatabaseUnavailableError,
  type SerializedActivityLog,
  type SerializedUser,
} from '../db/users.ts';

function makeUser(overrides: Partial<SerializedUser> = {}): SerializedUser {
  const now = new Date().toISOString();
  return {
    id: 1,
    uid: 'uid-client-1',
    email: 'client@example.com',
    displayName: 'CAREX Client',
    photoUrl: 'https://example.com/avatar.png',
    jurisdiction: 'Not Specified',
    role: 'CLIENT',
    accountStatus: 'ACTIVE',
    kycStatus: 'Not Submitted',
    walletStatus: 'Unlinked',
    walletAddress: null,
    notifySecurity: true,
    notifyKyc: true,
    notifyPlatform: false,
    createdAt: now,
    lastLoginAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makeDecodedToken(uid: string, email: string): DecodedIdToken {
  return {
    uid,
    email,
    email_verified: true,
    name: 'Test User',
    aud: 'carex-test',
    auth_time: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    firebase: { identities: {}, sign_in_provider: 'google.com' },
    iat: Math.floor(Date.now() / 1000),
    iss: 'https://securetoken.google.com/carex-test',
    sub: uid,
  };
}

async function withTestServer(
  overrides: Partial<ServerDependencies>,
  fn: (baseUrl: string) => Promise<void>
) {
  const app = createApiApp(overrides);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
  }
}

test('Scenario 6 & 10: rejects unauthenticated, invalid, and expired tokens with HTTP 401', async () => {
  await withTestServer(
    {
      isFirebaseAdminConfigured: () => true,
      isDatabaseConfigured: () => true,
      verifyIdToken: async (token: string) => {
        if (token === 'expired-token') {
          const err = new Error('Token expired') as Error & { code: string };
          err.code = 'auth/id-token-expired';
          throw err;
        }
        throw new Error('Invalid token');
      },
      logActivity: async () => {},
    },
    async (baseUrl) => {
      const noAuthMe = await fetch(`${baseUrl}/api/me`);
      assert.equal(noAuthMe.status, 401);

      const noAuthAdmin = await fetch(`${baseUrl}/api/admin/overview`);
      assert.equal(noAuthAdmin.status, 401);

      const invalidRes = await fetch(`${baseUrl}/api/me`, {
        headers: { Authorization: 'Bearer bad-token' },
      });
      assert.equal(invalidRes.status, 401);
      const invalidBody = await invalidRes.json();
      assert.equal(invalidBody.code, 'INVALID_TOKEN');

      const expiredRes = await fetch(`${baseUrl}/api/me`, {
        headers: { Authorization: 'Bearer expired-token' },
      });
      assert.equal(expiredRes.status, 401);
      const expiredBody = await expiredRes.json();
      assert.equal(expiredBody.code, 'TOKEN_EXPIRED');
    }
  );
});

test('Scenario 7, 8 & 9: enforces CLIENT vs ADMIN RBAC and blocks client self-escalation', async () => {
  const clientUser = makeUser({ id: 10, uid: 'uid-client', email: 'client@carex.test', role: 'CLIENT' });
  const adminUser = makeUser({ id: 1, uid: 'uid-admin', email: 'admin@carex.test', role: 'ADMIN' });
  const logs: SerializedActivityLog[] = [];

  await withTestServer(
    {
      isFirebaseAdminConfigured: () => true,
      isDatabaseConfigured: () => true,
      verifyIdToken: async (token: string) => {
        if (token === 'token-client') return makeDecodedToken(clientUser.uid, clientUser.email);
        if (token === 'token-admin') return makeDecodedToken(adminUser.uid, adminUser.email);
        throw new Error('Invalid token');
      },
      syncUser: async ({ uid }) => ({
        user: uid === adminUser.uid ? adminUser : clientUser,
        isNewUser: false,
      }),
      getUserLogs: async () => logs,
      getAdminOverview: async () => ({
        metrics: {
          totalUsers: 2,
          activeUsers: 2,
          underReviewUsers: 0,
          restrictedUsers: 0,
          adminUsers: 1,
        },
        users: [adminUser, clientUser],
        activityLogs: logs,
      }),
      updateProfile: async (_uid, patch) => ({ ...clientUser, ...patch }),
      logActivity: async () => {},
    },
    async (baseUrl) => {
      // Scenario 7: CLIENT cannot access ADMIN endpoints
      const clientAdminOverview = await fetch(`${baseUrl}/api/admin/overview`, {
        headers: { Authorization: 'Bearer token-client' },
      });
      assert.equal(clientAdminOverview.status, 403);

      const clientRestrictAttempt = await fetch(
        `${baseUrl}/api/admin/users/${clientUser.uid}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer token-client',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accountStatus: 'RESTRICTED' }),
        }
      );
      assert.equal(clientRestrictAttempt.status, 403);

      // Scenario 9: CLIENT cannot escalate own role via profile or settings
      const escalateProfile = await fetch(`${baseUrl}/api/me/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer token-client',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: 'Client',
          jurisdiction: 'Singapore',
          role: 'ADMIN',
        }),
      });
      assert.equal(escalateProfile.status, 403);
      const escBody = await escalateProfile.json();
      assert.equal(escBody.code, 'PRIVILEGE_ESCALATION_BLOCKED');

      // Scenario 8: Authorized ADMIN accesses ADMIN overview successfully
      const adminOverviewRes = await fetch(`${baseUrl}/api/admin/overview`, {
        headers: { Authorization: 'Bearer token-admin' },
      });
      assert.equal(adminOverviewRes.status, 200);
      const overviewBody = await adminOverviewRes.json();
      assert.equal(overviewBody.metrics.totalUsers, 2);
      assert.equal(overviewBody.metrics.adminUsers, 1);
    }
  );
});

test('Scenario 11: enforces RESTRICTED full block and UNDER_REVIEW read-only policy', async () => {
  const restrictedUser = makeUser({
    uid: 'uid-restricted',
    email: 'restricted@carex.test',
    accountStatus: 'RESTRICTED',
  });
  const reviewUser = makeUser({
    uid: 'uid-review',
    email: 'review@carex.test',
    accountStatus: 'UNDER_REVIEW',
  });

  await withTestServer(
    {
      isFirebaseAdminConfigured: () => true,
      isDatabaseConfigured: () => true,
      verifyIdToken: async (token: string) => {
        if (token === 'token-restricted') {
          return makeDecodedToken(restrictedUser.uid, restrictedUser.email);
        }
        if (token === 'token-review') {
          return makeDecodedToken(reviewUser.uid, reviewUser.email);
        }
        throw new Error('Invalid token');
      },
      syncUser: async ({ uid }) => ({
        user: uid === restrictedUser.uid ? restrictedUser : reviewUser,
        isNewUser: false,
      }),
      getUserLogs: async () => [],
      logActivity: async () => {},
    },
    async (baseUrl) => {
      // RESTRICTED user blocked on session, read, and write
      const restrictedSession = await fetch(`${baseUrl}/api/auth/session`, {
        method: 'POST',
        headers: { Authorization: 'Bearer token-restricted' },
      });
      assert.equal(restrictedSession.status, 403);
      assert.equal((await restrictedSession.json()).code, 'ACCOUNT_RESTRICTED');

      const restrictedMe = await fetch(`${baseUrl}/api/me`, {
        headers: { Authorization: 'Bearer token-restricted' },
      });
      assert.equal(restrictedMe.status, 403);

      const restrictedWrite = await fetch(`${baseUrl}/api/me/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer token-restricted',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName: 'Blocked', jurisdiction: 'US' }),
      });
      assert.equal(restrictedWrite.status, 403);

      // UNDER_REVIEW user allowed read (200), blocked on writes (403)
      const reviewRead = await fetch(`${baseUrl}/api/me`, {
        headers: { Authorization: 'Bearer token-review' },
      });
      assert.equal(reviewRead.status, 200);

      const reviewWrite = await fetch(`${baseUrl}/api/me/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer token-review',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName: 'Attempt', jurisdiction: 'US' }),
      });
      assert.equal(reviewWrite.status, 403);
      assert.equal((await reviewWrite.json()).code, 'ACCOUNT_UNDER_REVIEW');
    }
  );
});

test('Scenario 12: fails closed with HTTP 503 when database config or connection is unavailable', async () => {
  await withTestServer(
    {
      isFirebaseAdminConfigured: () => true,
      isDatabaseConfigured: () => false,
      logActivity: async () => {},
    },
    async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/auth/session`, {
        method: 'POST',
        headers: { Authorization: 'Bearer any-token' },
      });
      assert.equal(res.status, 503);
      const body = await res.json();
      assert.equal(body.code, 'DATABASE_UNAVAILABLE');
    }
  );

  await withTestServer(
    {
      isFirebaseAdminConfigured: () => true,
      isDatabaseConfigured: () => true,
      verifyIdToken: async () => makeDecodedToken('uid-db-down', 'user@carex.test'),
      syncUser: async () => {
        throw new DatabaseUnavailableError('Unable to reach database.');
      },
      logActivity: async () => {},
    },
    async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/me`, {
        headers: { Authorization: 'Bearer valid-token' },
      });
      assert.equal(res.status, 503);
      assert.equal((await res.json()).code, 'DATABASE_UNAVAILABLE');
    }
  );
});
