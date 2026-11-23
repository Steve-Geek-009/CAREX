import { desc, eq } from 'drizzle-orm';
import { db, isDatabaseConfigured } from './index.ts';
import {
  activityLogs,
  users,
  type ActivityLogRecord,
  type UserRecord,
} from './schema.ts';
import {
  normalizeAccountStatus,
  normalizeUserRole,
  type AccountStatus,
  type UserRole,
} from '../utils/rbac.ts';

export class DatabaseUnavailableError extends Error {
  constructor(message = 'User database service is currently unavailable.', options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'DatabaseUnavailableError';
  }
}

export interface SerializedUser {
  id: number;
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  jurisdiction: string;
  role: UserRole;
  accountStatus: AccountStatus;
  kycStatus: string;
  walletStatus: string;
  walletAddress: string | null;
  notifySecurity: boolean;
  notifyKyc: boolean;
  notifyPlatform: boolean;
  createdAt: string;
  lastLoginAt: string;
  updatedAt: string;
}

export interface SerializedActivityLog {
  id: number;
  eventCode: string;
  userUid: string | null;
  actorEmail: string;
  category: 'Authentication' | 'KYC' | 'Wallet' | 'Administration';
  summary: string;
  outcome: 'Recorded' | 'Blocked' | 'Pending';
  createdAt: string;
}

export interface AdminMetricsSummary {
  totalUsers: number;
  activeUsers: number;
  underReviewUsers: number;
  restrictedUsers: number;
  adminUsers: number;
}

export interface AdminOverviewPayload {
  metrics: AdminMetricsSummary;
  users: SerializedUser[];
  activityLogs: SerializedActivityLog[];
}

export function serializeUser(record: UserRecord): SerializedUser {
  return {
    id: record.id,
    uid: record.uid,
    email: record.email,
    displayName: record.displayName,
    photoUrl: record.photoUrl ?? null,
    jurisdiction: record.jurisdiction,
    role: normalizeUserRole(record.role),
    accountStatus: normalizeAccountStatus(record.accountStatus),
    kycStatus: record.kycStatus,
    walletStatus: record.walletStatus,
    walletAddress: record.walletAddress ?? null,
    notifySecurity: record.notifySecurity,
    notifyKyc: record.notifyKyc,
    notifyPlatform: record.notifyPlatform,
    createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt),
    lastLoginAt: record.lastLoginAt instanceof Date ? record.lastLoginAt.toISOString() : String(record.lastLoginAt),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt),
  };
}

export function serializeActivityLog(record: ActivityLogRecord): SerializedActivityLog {
  const category =
    record.category === 'KYC' ||
    record.category === 'Wallet' ||
    record.category === 'Administration'
      ? record.category
      : 'Authentication';
  const outcome =
    record.outcome === 'Blocked' || record.outcome === 'Pending'
      ? record.outcome
      : 'Recorded';

  return {
    id: record.id,
    eventCode: record.eventCode,
    userUid: record.userUid ?? null,
    actorEmail: record.actorEmail,
    category,
    summary: record.summary,
    outcome,
    createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt),
  };
}

function assertDatabaseReady(): void {
  if (!isDatabaseConfigured()) {
    throw new DatabaseUnavailableError(
      'Database configuration is missing. Authentication persistence cannot proceed.'
    );
  }
}

function isConnectionError(error: unknown): boolean {
  const code = (error as { code?: string; cause?: { code?: string } })?.code ??
    (error as { cause?: { code?: string } })?.cause?.code ??
    '';
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  return (
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOENT' ||
    code === '28P01' ||
    code === '3D000' ||
    message.includes('connect') ||
    message.includes('timeout')
  );
}

function sanitizePhotoUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export async function syncAuthenticatedUser(identity: {
  uid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
  recordLogin?: boolean;
}): Promise<{ user: SerializedUser; isNewUser: boolean }> {
  assertDatabaseReady();

  try {
    const normalizedEmail = identity.email.trim().toLowerCase();
    const safeDisplayName =
      identity.displayName?.trim() || normalizedEmail.split('@')[0] || 'CAREX Member';
    const safePhotoUrl = sanitizePhotoUrl(identity.photoUrl);
    const now = new Date();

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.uid, identity.uid))
      .limit(1);

    if (existing.length > 0) {
      const current = existing[0];
      const nextRole = normalizeUserRole(current.role);
      const nextStatus = normalizeAccountStatus(current.accountStatus);

      const updated = await db
        .update(users)
        .set({
          email: normalizedEmail,
          photoUrl: safePhotoUrl ?? current.photoUrl,
          role: nextRole,
          accountStatus: nextStatus,
          ...(identity.recordLogin ? { lastLoginAt: now } : {}),
          updatedAt: now,
        })
        .where(eq(users.uid, identity.uid))
        .returning();

      const serialized = serializeUser(updated[0]);
      if (identity.recordLogin) {
        await recordActivityLog({
          userUid: serialized.uid,
          actorEmail: serialized.email,
          category: 'Authentication',
          summary: 'Signed in with Google account.',
          outcome: serialized.accountStatus === 'RESTRICTED' ? 'Blocked' : 'Recorded',
        });
      }
      return { user: serialized, isNewUser: false };
    }

    // First-time Google authentication: always provision as CLIENT / ACTIVE via atomic upsert.
    const inserted = await db
      .insert(users)
      .values({
        uid: identity.uid,
        email: normalizedEmail,
        displayName: safeDisplayName,
        photoUrl: safePhotoUrl,
        role: 'CLIENT',
        accountStatus: 'ACTIVE',
        kycStatus: 'Not Submitted',
        walletStatus: 'Unlinked',
        createdAt: now,
        lastLoginAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: normalizedEmail,
          photoUrl: safePhotoUrl,
          lastLoginAt: now,
          updatedAt: now,
        },
      })
      .returning();

    const serialized = serializeUser(inserted[0]);
    const isNewUser = Math.abs(inserted[0].createdAt.getTime() - now.getTime()) < 5000;

    await recordActivityLog({
      userUid: serialized.uid,
      actorEmail: serialized.email,
      category: 'Authentication',
      summary: isNewUser
        ? 'Created CAREX account automatically via Google Sign-In.'
        : 'Signed in with Google account.',
      outcome: 'Recorded',
    });

    return { user: serialized, isNewUser };
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) throw error;
    console.error('Database query failed in syncAuthenticatedUser:', error instanceof Error ? error.message : error);
    if (isConnectionError(error)) {
      throw new DatabaseUnavailableError('Unable to reach the CAREX user database.', { cause: error });
    }
    throw new Error('Unable to synchronize user account at this time.', { cause: error });
  }
}

export async function updateUserProfileRecord(
  uid: string,
  patch: { displayName: string; jurisdiction: string }
): Promise<SerializedUser | null> {
  assertDatabaseReady();

  try {
    const updated = await db
      .update(users)
      .set({
        displayName: patch.displayName.trim(),
        jurisdiction: patch.jurisdiction.trim(),
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();

    const record = updated[0] ? serializeUser(updated[0]) : null;
    if (record) {
      await recordActivityLog({
        userUid: record.uid,
        actorEmail: record.email,
        category: 'Authentication',
        summary: 'Updated client account profile details.',
        outcome: 'Recorded',
      });
    }
    return record;
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) throw error;
    console.error('Database query failed in updateUserProfileRecord:', error instanceof Error ? error.message : error);
    if (isConnectionError(error)) {
      throw new DatabaseUnavailableError('Unable to reach the CAREX user database.', { cause: error });
    }
    throw new Error('Unable to update user profile at this time.', { cause: error });
  }
}

export async function updateUserSettingsRecord(
  uid: string,
  prefs: { notifySecurity: boolean; notifyKyc: boolean; notifyPlatform: boolean }
): Promise<SerializedUser | null> {
  assertDatabaseReady();

  try {
    const updated = await db
      .update(users)
      .set({
        notifySecurity: prefs.notifySecurity,
        notifyKyc: prefs.notifyKyc,
        notifyPlatform: prefs.notifyPlatform,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();

    const record = updated[0] ? serializeUser(updated[0]) : null;
    if (record) {
      await recordActivityLog({
        userUid: record.uid,
        actorEmail: record.email,
        category: 'Authentication',
        summary: 'Updated account notification preferences.',
        outcome: 'Recorded',
      });
    }
    return record;
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) throw error;
    console.error('Database query failed in updateUserSettingsRecord:', error instanceof Error ? error.message : error);
    if (isConnectionError(error)) {
      throw new DatabaseUnavailableError('Unable to reach the CAREX user database.', { cause: error });
    }
    throw new Error('Unable to update notification settings at this time.', { cause: error });
  }
}

export async function getUserActivityLogs(uid: string): Promise<SerializedActivityLog[]> {
  assertDatabaseReady();

  try {
    const rows = await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userUid, uid))
      .orderBy(desc(activityLogs.createdAt))
      .limit(25);
    return rows.map(serializeActivityLog);
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) throw error;
    console.error('Database query failed in getUserActivityLogs:', error instanceof Error ? error.message : error);
    if (isConnectionError(error)) {
      throw new DatabaseUnavailableError('Unable to reach the CAREX user database.', { cause: error });
    }
    throw new Error('Unable to load account activity logs.', { cause: error });
  }
}

export async function recordActivityLog(entry: {
  userUid?: string | null;
  actorEmail: string;
  category: 'Authentication' | 'KYC' | 'Wallet' | 'Administration';
  summary: string;
  outcome: 'Recorded' | 'Blocked' | 'Pending';
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  try {
    const eventCode = `LOG-${Date.now().toString(36).toUpperCase()}`;
    await db.insert(activityLogs).values({
      eventCode,
      userUid: entry.userUid ?? null,
      actorEmail: entry.actorEmail,
      category: entry.category,
      summary: entry.summary,
      outcome: entry.outcome,
    });
  } catch (error) {
    console.error('Failed to write activity log:', error instanceof Error ? error.message : error);
  }
}

export async function getAdminOverviewData(): Promise<AdminOverviewPayload> {
  assertDatabaseReady();

  try {
    const [allUserRows, recentLogRows] = await Promise.all([
      db.select().from(users).orderBy(desc(users.createdAt)).limit(200),
      db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(200),
    ]);

    const serializedUsers = allUserRows.map(serializeUser);
    const serializedLogs = recentLogRows.map(serializeActivityLog);

    const metrics: AdminMetricsSummary = {
      totalUsers: serializedUsers.length,
      activeUsers: serializedUsers.filter((u) => u.accountStatus === 'ACTIVE').length,
      underReviewUsers: serializedUsers.filter((u) => u.accountStatus === 'UNDER_REVIEW').length,
      restrictedUsers: serializedUsers.filter((u) => u.accountStatus === 'RESTRICTED').length,
      adminUsers: serializedUsers.filter((u) => u.role === 'ADMIN').length,
    };

    return {
      metrics,
      users: serializedUsers,
      activityLogs: serializedLogs,
    };
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) throw error;
    console.error('Database query failed in getAdminOverviewData:', error instanceof Error ? error.message : error);
    if (isConnectionError(error)) {
      throw new DatabaseUnavailableError('Unable to reach the CAREX user database.', { cause: error });
    }
    throw new Error('Unable to load administrative records at this time.', { cause: error });
  }
}

export async function updateAccountRestrictionStatus(
  targetUid: string,
  nextStatus: AccountStatus,
  adminUser: { uid: string; email: string }
): Promise<{ user: SerializedUser | null; blockedReason?: string }> {
  assertDatabaseReady();

  try {
    const existing = await db.select().from(users).where(eq(users.uid, targetUid)).limit(1);
    if (existing.length === 0) {
      return { user: null };
    }

    const target = serializeUser(existing[0]);
    if (target.uid === adminUser.uid) {
      return { user: null, blockedReason: 'Administrators cannot modify their own account restriction status.' };
    }
    if (target.role === 'ADMIN') {
      return { user: null, blockedReason: 'Protected ADMIN accounts cannot be restricted via this endpoint.' };
    }

    const updated = await db
      .update(users)
      .set({
        accountStatus: nextStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, targetUid))
      .returning();

    const record = updated[0] ? serializeUser(updated[0]) : null;
    if (record) {
      await recordActivityLog({
        userUid: record.uid,
        actorEmail: adminUser.email,
        category: 'Administration',
        summary: `Updated account status for ${record.email} to ${nextStatus}.`,
        outcome: 'Recorded',
      });
    }
    return { user: record };
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) throw error;
    console.error('Database query failed in updateAccountRestrictionStatus:', error instanceof Error ? error.message : error);
    if (isConnectionError(error)) {
      throw new DatabaseUnavailableError('Unable to reach the CAREX user database.', { cause: error });
    }
    throw new Error('Unable to update account status at this time.', { cause: error });
  }
}
