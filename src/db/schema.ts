import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name').notNull(),
  photoUrl: text('photo_url'),
  jurisdiction: text('jurisdiction').notNull().default('Not Specified'),
  role: text('role').notNull().default('CLIENT'),
  accountStatus: text('account_status').notNull().default('ACTIVE'),
  kycStatus: text('kyc_status').notNull().default('Not Submitted'),
  walletStatus: text('wallet_status').notNull().default('Unlinked'),
  walletAddress: text('wallet_address'),
  notifySecurity: boolean('notify_security').notNull().default(true),
  notifyKyc: boolean('notify_kyc').notNull().default(true),
  notifyPlatform: boolean('notify_platform').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const kycApplications = pgTable('kyc_applications', {
  id: serial('id').primaryKey(),
  applicationCode: text('application_code').notNull().unique(),
  userUid: text('user_uid')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  applicantLabel: text('applicant_label').notNull(),
  providerChannel: text('provider_channel')
    .notNull()
    .default('Authorized KYC Provider (Scheduled)'),
  status: text('status').notNull().default('Pending'),
  reviewNote: text('review_note').notNull().default(''),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  eventCode: text('event_code').notNull(),
  userUid: text('user_uid').references(() => users.uid, { onDelete: 'set null' }),
  actorEmail: text('actor_email').notNull(),
  category: text('category').notNull(),
  summary: text('summary').notNull(),
  outcome: text('outcome').notNull().default('Recorded'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  kycApplications: many(kycApplications),
  activityLogs: many(activityLogs),
}));

export const kycApplicationsRelations = relations(kycApplications, ({ one }) => ({
  user: one(users, {
    fields: [kycApplications.userUid],
    references: [users.uid],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userUid],
    references: [users.uid],
  }),
}));

export type UserRecord = typeof users.$inferSelect;
export type KycApplicationRecord = typeof kycApplications.$inferSelect;
export type ActivityLogRecord = typeof activityLogs.$inferSelect;
