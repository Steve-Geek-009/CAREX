import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import {
  activityLogs,
  kycApplications,
  users,
  type ActivityLogRecord,
  type KycApplicationRecord,
  type UserRecord,
} from './schema.ts';

const OWNER_ADMIN_EMAILS = new Set(['stephansatish009@gmail.com']);

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName: string
): Promise<UserRecord> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const defaultRole = OWNER_ADMIN_EMAILS.has(normalizedEmail) ? 'admin' : 'client';
    const safeDisplayName = displayName.trim() || normalizedEmail.split('@')[0] || 'CAREX Member';

    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      const updated = await db
        .update(users)
        .set({
          email: normalizedEmail,
          updatedAt: new Date(),
        })
        .where(eq(users.uid, uid))
        .returning();
      return updated[0];
    }

    const inserted = await db
      .insert(users)
      .values({
        uid,
        email: normalizedEmail,
        displayName: safeDisplayName,
        role: defaultRole,
        accountStatus: 'Active',
        kycStatus: 'Not Submitted',
        walletStatus: 'Unlinked',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: normalizedEmail,
          updatedAt: new Date(),
        },
      })
      .returning();

    const record = inserted[0];
    await recordActivityLog({
      userUid: record.uid,
      actorEmail: record.email,
      category: 'Authentication',
      summary: 'Account authenticated via Google Sign-In and synchronized.',
      outcome: 'Recorded',
    });

    return record;
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Unable to load user profile at this time.', { cause: error });
  }
}

export async function updateUserProfileRecord(
  uid: string,
  patch: { displayName: string; jurisdiction: string }
): Promise<UserRecord | null> {
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

    const record = updated[0] ?? null;
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
    console.error('Database query failed in updateUserProfileRecord:', error);
    throw new Error('Unable to update user profile at this time.', { cause: error });
  }
}

export async function updateUserSettingsRecord(
  uid: string,
  prefs: { notifySecurity: boolean; notifyKyc: boolean; notifyPlatform: boolean }
): Promise<UserRecord | null> {
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
    return updated[0] ?? null;
  } catch (error) {
    console.error('Database query failed in updateUserSettingsRecord:', error);
    throw new Error('Unable to update notification settings at this time.', { cause: error });
  }
}

export async function getUserActivityLogs(uid: string): Promise<ActivityLogRecord[]> {
  try {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userUid, uid))
      .orderBy(desc(activityLogs.createdAt))
      .limit(20);
  } catch (error) {
    console.error('Database query failed in getUserActivityLogs:', error);
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
    console.error('Failed to write activity log:', error);
  }
}

export async function getAdminOverviewData(): Promise<{
  users: UserRecord[];
  kycApplications: KycApplicationRecord[];
  activityLogs: ActivityLogRecord[];
}> {
  try {
    const [allUsers, allKyc, recentLogs] = await Promise.all([
      db.select().from(users).orderBy(desc(users.createdAt)).limit(100),
      db.select().from(kycApplications).orderBy(desc(kycApplications.submittedAt)).limit(100),
      db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(100),
    ]);
    return {
      users: allUsers,
      kycApplications: allKyc,
      activityLogs: recentLogs,
    };
  } catch (error) {
    console.error('Database query failed in getAdminOverviewData:', error);
    throw new Error('Unable to load administrative records at this time.', { cause: error });
  }
}

export async function updateAccountRestrictionStatus(
  targetUid: string,
  nextStatus: 'Active' | 'Restricted' | 'Under Review',
  adminEmail: string
): Promise<UserRecord | null> {
  try {
    const updated = await db
      .update(users)
      .set({
        accountStatus: nextStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, targetUid))
      .returning();

    const record = updated[0] ?? null;
    if (record) {
      await recordActivityLog({
        userUid: record.uid,
        actorEmail: adminEmail,
        category: 'Administration',
        summary: `Updated account status for ${record.email} to ${nextStatus}.`,
        outcome: 'Recorded',
      });
    }
    return record;
  } catch (error) {
    console.error('Database query failed in updateAccountRestrictionStatus:', error);
    throw new Error('Unable to update account status at this time.', { cause: error });
  }
}
