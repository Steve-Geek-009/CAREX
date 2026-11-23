import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { db } from '../src/db/index.ts';
import { activityLogs, users } from '../src/db/schema.ts';

dotenv.config();

/**
 * Controlled server-side procedure to promote an existing, Google-authenticated
 * CAREX user record to the ADMIN role.
 *
 * Usage:
 *   npx tsx scripts/promote-admin.ts --uid <FIREBASE_UID>
 *   npx tsx scripts/promote-admin.ts --email <VERIFIED_EMAIL>
 *
 * This script never creates unauthenticated accounts and never grants admin
 * access from browser state.
 */
async function main() {
  const args = process.argv.slice(2);
  const uidIndex = args.indexOf('--uid');
  const emailIndex = args.indexOf('--email');

  const uid = uidIndex >= 0 ? args[uidIndex + 1]?.trim() : '';
  const email = emailIndex >= 0 ? args[emailIndex + 1]?.trim().toLowerCase() : '';

  if (!uid && !email) {
    console.error(
      'Usage: npx tsx scripts/promote-admin.ts --uid <FIREBASE_UID> | --email <VERIFIED_EMAIL>'
    );
    process.exit(1);
  }

  const matches = uid
    ? await db.select().from(users).where(eq(users.uid, uid)).limit(1)
    : await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (matches.length === 0) {
    console.error(
      'No existing user record found. The operator must complete Google Sign-In at least once before promotion.'
    );
    process.exit(1);
  }

  const target = matches[0];
  const updated = await db
    .update(users)
    .set({
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      updatedAt: new Date(),
    })
    .where(eq(users.uid, target.uid))
    .returning();

  await db.insert(activityLogs).values({
    eventCode: `ADM-${Date.now().toString(36).toUpperCase()}`,
    userUid: target.uid,
    actorEmail: 'system-operator',
    category: 'Administration',
    summary: `Promoted user ${target.email} (UID ${target.uid}) to ADMIN role via controlled server procedure.`,
    outcome: 'Recorded',
  });

  console.log(
    `Promoted user id=${updated[0].id} uid=${updated[0].uid} email=${updated[0].email} to role=${updated[0].role}.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to promote administrator:', err instanceof Error ? err.message : err);
  process.exit(1);
});
