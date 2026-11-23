import type { NextFunction, Request, Response } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { isDatabaseConfigured } from '../db/index.ts';
import {
  DatabaseUnavailableError,
  recordActivityLog,
  syncAuthenticatedUser,
  type SerializedUser,
} from '../db/users.ts';
import {
  isFirebaseAdminConfigured,
  verifyFirebaseIdToken,
} from '../lib/firebase-admin.ts';
import { canAccessAccountRead, canMutateAccount } from '../utils/rbac.ts';

export interface AuthDependencies {
  isFirebaseAdminConfigured: () => boolean;
  isDatabaseConfigured: () => boolean;
  verifyIdToken: (token: string) => Promise<DecodedIdToken>;
  syncUser: typeof syncAuthenticatedUser;
  logActivity: typeof recordActivityLog;
}

const defaultAuthDeps: AuthDependencies = {
  isFirebaseAdminConfigured,
  isDatabaseConfigured,
  verifyIdToken: verifyFirebaseIdToken,
  syncUser: syncAuthenticatedUser,
  logActivity: recordActivityLog,
};

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: SerializedUser;
  isNewUser?: boolean;
}

export function createAuthMiddleware(deps: AuthDependencies = defaultAuthDeps) {
  const requireAuth = (options: { recordLogin?: boolean } = {}) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      // Fail closed if backend authentication or database configuration is missing.
      if (!deps.isFirebaseAdminConfigured()) {
        return res.status(503).json({
          error: 'Authentication service is not configured. Please contact CAREX support.',
          code: 'AUTH_SERVICE_UNAVAILABLE',
        });
      }
      if (!deps.isDatabaseConfigured()) {
        return res.status(503).json({
          error: 'Account persistence service is currently unavailable.',
          code: 'DATABASE_UNAVAILABLE',
        });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Authentication required.',
          code: 'MISSING_TOKEN',
        });
      }

      const token = authHeader.slice('Bearer '.length).trim();
      if (!token) {
        return res.status(401).json({
          error: 'Authentication required.',
          code: 'MISSING_TOKEN',
        });
      }

      let decodedToken: DecodedIdToken;
      try {
        decodedToken = await deps.verifyIdToken(token);
      } catch (error: unknown) {
        const code = (error as { code?: string })?.code ?? '';
        const isExpired = code === 'auth/id-token-expired';
        const isRevoked = code === 'auth/id-token-revoked';
        console.error('Firebase ID token verification failed:', code || 'invalid-token');
        return res.status(401).json({
          error: isExpired
            ? 'Your authentication session has expired. Please sign in again.'
            : isRevoked
              ? 'Your authentication session has been revoked. Please sign in again.'
              : 'Invalid authentication token.',
          code: isExpired ? 'TOKEN_EXPIRED' : isRevoked ? 'TOKEN_REVOKED' : 'INVALID_TOKEN',
        });
      }

      const uid = typeof decodedToken.uid === 'string' ? decodedToken.uid.trim() : '';
      const email = typeof decodedToken.email === 'string' ? decodedToken.email.trim().toLowerCase() : '';
      if (!uid || !email) {
        return res.status(401).json({
          error: 'Verified Google account identity with an email address is required.',
          code: 'INVALID_IDENTITY',
        });
      }

      if (decodedToken.email_verified === false) {
        return res.status(403).json({
          error: 'A verified Google email address is required to access CAREX.',
          code: 'EMAIL_NOT_VERIFIED',
        });
      }

      try {
        const { user, isNewUser } = await deps.syncUser({
          uid,
          email,
          displayName: typeof decodedToken.name === 'string' ? decodedToken.name : null,
          photoUrl: typeof decodedToken.picture === 'string' ? decodedToken.picture : null,
          recordLogin: Boolean(options.recordLogin),
        });
        req.user = decodedToken;
        req.dbUser = user;
        req.isNewUser = isNewUser;
        next();
      } catch (error) {
        if (error instanceof DatabaseUnavailableError) {
          return res.status(503).json({
            error: error.message,
            code: 'DATABASE_UNAVAILABLE',
          });
        }
        return res.status(500).json({
          error: 'Unable to verify account record.',
          code: 'ACCOUNT_SYNC_FAILED',
        });
      }
    };
  };

  const requireNotRestricted = (req: AuthRequest, res: Response, next: NextFunction) => {
    const dbUser = req.dbUser;
    if (!dbUser) {
      return res.status(401).json({ error: 'Authentication required.', code: 'MISSING_TOKEN' });
    }
    if (!canAccessAccountRead(dbUser.accountStatus)) {
      void deps.logActivity({
        userUid: dbUser.uid,
        actorEmail: dbUser.email,
        category: 'Authentication',
        summary: `Blocked access to ${req.method} ${req.path} due to RESTRICTED account status.`,
        outcome: 'Blocked',
      });
      return res.status(403).json({
        error: 'Your CAREX account is restricted. Contact CAREX compliance support for assistance.',
        code: 'ACCOUNT_RESTRICTED',
        accountStatus: dbUser.accountStatus,
      });
    }
    next();
  };

  const requireActiveForWrite = (req: AuthRequest, res: Response, next: NextFunction) => {
    const dbUser = req.dbUser;
    if (!dbUser) {
      return res.status(401).json({ error: 'Authentication required.', code: 'MISSING_TOKEN' });
    }
    if (dbUser.accountStatus === 'RESTRICTED') {
      void deps.logActivity({
        userUid: dbUser.uid,
        actorEmail: dbUser.email,
        category: 'Authentication',
        summary: `Blocked write attempt to ${req.method} ${req.path} for RESTRICTED account.`,
        outcome: 'Blocked',
      });
      return res.status(403).json({
        error: 'Your CAREX account is restricted. Account modifications are not permitted.',
        code: 'ACCOUNT_RESTRICTED',
        accountStatus: dbUser.accountStatus,
      });
    }
    if (!canMutateAccount(dbUser.accountStatus)) {
      void deps.logActivity({
        userUid: dbUser.uid,
        actorEmail: dbUser.email,
        category: 'Authentication',
        summary: `Blocked write attempt to ${req.method} ${req.path} while account is UNDER_REVIEW.`,
        outcome: 'Blocked',
      });
      return res.status(403).json({
        error: 'Your CAREX account is currently under review. Portal access is read-only until review completes.',
        code: 'ACCOUNT_UNDER_REVIEW',
        accountStatus: dbUser.accountStatus,
      });
    }
    next();
  };

  const requireAdminRole = (req: AuthRequest, res: Response, next: NextFunction) => {
    const dbUser = req.dbUser;
    if (!dbUser) {
      return res.status(401).json({ error: 'Authentication required.', code: 'MISSING_TOKEN' });
    }
    if (dbUser.accountStatus !== 'ACTIVE') {
      void deps.logActivity({
        userUid: dbUser.uid,
        actorEmail: dbUser.email,
        category: 'Administration',
        summary: `Blocked admin endpoint ${req.method} ${req.path} due to ${dbUser.accountStatus} status.`,
        outcome: 'Blocked',
      });
      return res.status(403).json({
        error: 'Active account status is required for administrative access.',
        code: dbUser.accountStatus === 'RESTRICTED' ? 'ACCOUNT_RESTRICTED' : 'ACCOUNT_UNDER_REVIEW',
        accountStatus: dbUser.accountStatus,
      });
    }
    if (dbUser.role !== 'ADMIN') {
      void deps.logActivity({
        userUid: dbUser.uid,
        actorEmail: dbUser.email,
        category: 'Administration',
        summary: `Blocked unauthorized administrative request to ${req.method} ${req.path} by CLIENT user.`,
        outcome: 'Blocked',
      });
      return res.status(403).json({
        error: 'Administrative privileges are required for this endpoint.',
        code: 'ADMIN_REQUIRED',
      });
    }
    next();
  };

  return {
    requireAuth,
    requireNotRestricted,
    requireActiveForWrite,
    requireAdminRole,
  };
}

const defaultMiddleware = createAuthMiddleware();
export const requireAuth = defaultMiddleware.requireAuth();
export const requireAuthLogin = defaultMiddleware.requireAuth({ recordLogin: true });
export const requireNotRestricted = defaultMiddleware.requireNotRestricted;
export const requireActiveForWrite = defaultMiddleware.requireActiveForWrite;
export const requireAdminRole = defaultMiddleware.requireAdminRole;
