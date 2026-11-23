import express, { type Express } from 'express';
import {
  DatabaseUnavailableError,
  getAdminOverviewData,
  getUserActivityLogs,
  recordActivityLog,
  syncAuthenticatedUser,
  updateAccountRestrictionStatus,
  updateUserProfileRecord,
  updateUserSettingsRecord,
} from '../db/users.ts';
import { isDatabaseConfigured } from '../db/index.ts';
import {
  isFirebaseAdminConfigured,
  verifyFirebaseIdToken,
} from '../lib/firebase-admin.ts';
import {
  createAuthMiddleware,
  type AuthDependencies,
  type AuthRequest,
} from '../middleware/auth.ts';
import { isValidAccountStatusInput } from '../utils/rbac.ts';

export interface ServerDependencies extends AuthDependencies {
  getUserLogs: typeof getUserActivityLogs;
  updateProfile: typeof updateUserProfileRecord;
  updateSettings: typeof updateUserSettingsRecord;
  getAdminOverview: typeof getAdminOverviewData;
  updateUserStatus: typeof updateAccountRestrictionStatus;
}

const defaultServerDeps: ServerDependencies = {
  isFirebaseAdminConfigured,
  isDatabaseConfigured,
  verifyIdToken: verifyFirebaseIdToken,
  syncUser: syncAuthenticatedUser,
  logActivity: recordActivityLog,
  getUserLogs: getUserActivityLogs,
  updateProfile: updateUserProfileRecord,
  updateSettings: updateUserSettingsRecord,
  getAdminOverview: getAdminOverviewData,
  updateUserStatus: updateAccountRestrictionStatus,
};

function hasPrivilegedFieldMutationAttempt(body: Record<string, unknown> | undefined): boolean {
  if (!body || typeof body !== 'object') return false;
  return (
    'role' in body ||
    'accountStatus' in body ||
    'uid' in body ||
    'id' in body ||
    'email' in body ||
    'kycStatus' in body
  );
}

export function createApiApp(overrides: Partial<ServerDependencies> = {}): Express {
  const deps: ServerDependencies = { ...defaultServerDeps, ...overrides };
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const {
    requireAuth,
    requireNotRestricted,
    requireActiveForWrite,
    requireAdminRole,
  } = createAuthMiddleware(deps);

  const requireSessionAuth = requireAuth({ recordLogin: true });
  const requireStandardAuth = requireAuth({ recordLogin: false });

  // Establish / refresh authenticated session after Google Sign-In
  app.post(
    '/api/auth/session',
    requireSessionAuth,
    requireNotRestricted,
    async (req: AuthRequest, res) => {
      try {
        const dbUser = req.dbUser!;
        const logs = await deps.getUserLogs(dbUser.uid);
        res.json({
          user: dbUser,
          isNewUser: Boolean(req.isNewUser),
          activityLogs: logs,
        });
      } catch (error: unknown) {
        if (error instanceof DatabaseUnavailableError) {
          return res.status(503).json({ error: error.message, code: 'DATABASE_UNAVAILABLE' });
        }
        console.error('POST /api/auth/session failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Unable to complete sign-in session.' });
      }
    }
  );

  // Authenticated Client Account API (read allowed for ACTIVE & UNDER_REVIEW; blocked for RESTRICTED)
  app.get('/api/me', requireStandardAuth, requireNotRestricted, async (req: AuthRequest, res) => {
    try {
      const dbUser = req.dbUser!;
      const logs = await deps.getUserLogs(dbUser.uid);
      res.json({
        user: dbUser,
        activityLogs: logs,
      });
    } catch (error: unknown) {
      if (error instanceof DatabaseUnavailableError) {
        return res.status(503).json({ error: error.message, code: 'DATABASE_UNAVAILABLE' });
      }
      console.error('GET /api/me failed:', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Unable to load account profile.' });
    }
  });

  app.get(
    '/api/me/activity',
    requireStandardAuth,
    requireNotRestricted,
    async (req: AuthRequest, res) => {
      try {
        const logs = await deps.getUserLogs(req.dbUser!.uid);
        res.json({ activityLogs: logs });
      } catch (error: unknown) {
        if (error instanceof DatabaseUnavailableError) {
          return res.status(503).json({ error: error.message, code: 'DATABASE_UNAVAILABLE' });
        }
        console.error('GET /api/me/activity failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Unable to load account activity logs.' });
      }
    }
  );

  // Authenticated Client Write API (ACTIVE only; rejects UNDER_REVIEW & RESTRICTED and blocks role escalation)
  app.patch(
    '/api/me/profile',
    requireStandardAuth,
    requireActiveForWrite,
    async (req: AuthRequest, res) => {
      try {
        if (hasPrivilegedFieldMutationAttempt(req.body)) {
          void deps.logActivity({
            userUid: req.dbUser!.uid,
            actorEmail: req.dbUser!.email,
            category: 'Authentication',
            summary: 'Blocked client attempt to modify privileged account attributes via profile endpoint.',
            outcome: 'Blocked',
          });
          return res.status(403).json({
            error: 'Privileged account fields (such as role or account status) cannot be modified by clients.',
            code: 'PRIVILEGE_ESCALATION_BLOCKED',
          });
        }

        const displayName = String(req.body?.displayName ?? '').trim();
        const jurisdiction = String(req.body?.jurisdiction ?? '').trim();

        if (displayName.length < 2 || displayName.length > 100) {
          return res
            .status(400)
            .json({ error: 'Display name must be between 2 and 100 characters.' });
        }
        if (jurisdiction.length < 2 || jurisdiction.length > 100) {
          return res
            .status(400)
            .json({ error: 'Jurisdiction must be between 2 and 100 characters.' });
        }

        const updated = await deps.updateProfile(req.dbUser!.uid, {
          displayName,
          jurisdiction,
        });
        if (!updated) {
          return res.status(404).json({ error: 'Account record not found.' });
        }
        res.json({ user: updated });
      } catch (error: unknown) {
        if (error instanceof DatabaseUnavailableError) {
          return res.status(503).json({ error: error.message, code: 'DATABASE_UNAVAILABLE' });
        }
        console.error('PATCH /api/me/profile failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Unable to save profile updates.' });
      }
    }
  );

  app.patch(
    '/api/me/settings',
    requireStandardAuth,
    requireActiveForWrite,
    async (req: AuthRequest, res) => {
      try {
        if (hasPrivilegedFieldMutationAttempt(req.body)) {
          void deps.logActivity({
            userUid: req.dbUser!.uid,
            actorEmail: req.dbUser!.email,
            category: 'Authentication',
            summary: 'Blocked client attempt to modify privileged account attributes via settings endpoint.',
            outcome: 'Blocked',
          });
          return res.status(403).json({
            error: 'Privileged account fields cannot be modified via account settings.',
            code: 'PRIVILEGE_ESCALATION_BLOCKED',
          });
        }

        const notifySecurity = Boolean(req.body?.notifySecurity);
        const notifyKyc = Boolean(req.body?.notifyKyc);
        const notifyPlatform = Boolean(req.body?.notifyPlatform);

        const updated = await deps.updateSettings(req.dbUser!.uid, {
          notifySecurity,
          notifyKyc,
          notifyPlatform,
        });
        if (!updated) {
          return res.status(404).json({ error: 'Account record not found.' });
        }
        res.json({ user: updated });
      } catch (error: unknown) {
        if (error instanceof DatabaseUnavailableError) {
          return res.status(503).json({ error: error.message, code: 'DATABASE_UNAVAILABLE' });
        }
        console.error('PATCH /api/me/settings failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Unable to update notification settings.' });
      }
    }
  );

  // RBAC-Protected Admin API (Strictly ADMIN role + ACTIVE status)
  app.get(
    '/api/admin/overview',
    requireStandardAuth,
    requireAdminRole,
    async (_req, res) => {
      try {
        const data = await deps.getAdminOverview();
        res.json(data);
      } catch (error: unknown) {
        if (error instanceof DatabaseUnavailableError) {
          return res.status(503).json({ error: error.message, code: 'DATABASE_UNAVAILABLE' });
        }
        console.error('GET /api/admin/overview failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Unable to load administrative overview.' });
      }
    }
  );

  app.get(
    '/api/admin/users',
    requireStandardAuth,
    requireAdminRole,
    async (_req, res) => {
      try {
        const data = await deps.getAdminOverview();
        res.json({ users: data.users, metrics: data.metrics });
      } catch (error: unknown) {
        if (error instanceof DatabaseUnavailableError) {
          return res.status(503).json({ error: error.message, code: 'DATABASE_UNAVAILABLE' });
        }
        console.error('GET /api/admin/users failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Unable to load user directory.' });
      }
    }
  );

  app.get(
    '/api/admin/logs',
    requireStandardAuth,
    requireAdminRole,
    async (_req, res) => {
      try {
        const data = await deps.getAdminOverview();
        res.json({ activityLogs: data.activityLogs });
      } catch (error: unknown) {
        if (error instanceof DatabaseUnavailableError) {
          return res.status(503).json({ error: error.message, code: 'DATABASE_UNAVAILABLE' });
        }
        console.error('GET /api/admin/logs failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Unable to load activity logs.' });
      }
    }
  );

  app.patch(
    '/api/admin/users/:uid/status',
    requireStandardAuth,
    requireAdminRole,
    async (req: AuthRequest, res) => {
      try {
        const targetUid = String(req.params.uid ?? '').trim();
        const nextStatus = req.body?.accountStatus;

        if (!targetUid) {
          return res.status(400).json({ error: 'Target user identifier is required.' });
        }
        if (!isValidAccountStatusInput(nextStatus)) {
          return res.status(400).json({
            error: 'Account status must be ACTIVE, UNDER_REVIEW, or RESTRICTED.',
          });
        }

        const result = await deps.updateUserStatus(targetUid, nextStatus, {
          uid: req.dbUser!.uid,
          email: req.dbUser!.email,
        });

        if (result.blockedReason) {
          return res.status(403).json({ error: result.blockedReason });
        }
        if (!result.user) {
          return res.status(404).json({ error: 'Target account not found.' });
        }
        res.json({ user: result.user });
      } catch (error: unknown) {
        if (error instanceof DatabaseUnavailableError) {
          return res.status(503).json({ error: error.message, code: 'DATABASE_UNAVAILABLE' });
        }
        console.error('PATCH /api/admin/users/:uid/status failed:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Unable to update account status.' });
      }
    }
  );

  return app;
}
