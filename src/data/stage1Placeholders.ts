import type { UserRole } from '../utils/rbac';

/**
 * STAGE 1 PLACEHOLDER DATASETS
 * ---------------------------------------------------------------------------
 * These datasets exist strictly for Stage 1 layout and interaction previews.
 * They are clearly labelled as placeholder data in the UI.
 * No financial balances, tokenomics figures, or live blockchain transactions
 * are fabricated here.
 */

export interface ClientProfilePlaceholder {
  accountId: string;
  displayName: string;
  contactEmail: string;
  jurisdiction: string;
  accountStatus: 'Preview Account (Unverified)';
  kycStatus: 'Not Submitted';
  walletConnected: boolean;
  walletAddress: string | null;
  emailVerified: boolean;
}

export interface PlatformNotification {
  id: string;
  title: string;
  detail: string;
  category: 'Platform' | 'Security' | 'Verification';
  timestamp: string;
}

export interface AdminUserPlaceholder {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  accountStatus: 'Active' | 'Restricted' | 'Under Review';
  kycStatus: 'Pending' | 'Verified' | 'Rejected' | 'Not Submitted';
  walletStatus: 'Unlinked' | 'Signature Pending' | 'Linked (Placeholder)';
  registeredDate: string;
}

export interface AdminKycPlaceholder {
  applicationId: string;
  userId: string;
  applicantLabel: string;
  providerChannel: 'Authorized KYC Provider (Scheduled)' | 'DigiLocker Integration (Future Stage)';
  status: 'Pending' | 'Verified' | 'Rejected';
  submittedAt: string;
  reviewNote: string;
}

export interface AdminWalletPlaceholder {
  recordId: string;
  userId: string;
  accountLabel: string;
  publicAddressPreview: string;
  verificationMethod: 'Cryptographic Signature (Stage 2)';
  status: 'Pending Signature' | 'Verified (Placeholder)' | 'Revoked';
  updatedAt: string;
}

export interface AdminActivityLogPlaceholder {
  eventId: string;
  timestampUtc: string;
  category: 'Authentication' | 'KYC' | 'Wallet' | 'Administration';
  actor: string;
  summary: string;
  outcome: 'Recorded' | 'Blocked' | 'Pending';
}

export const INITIAL_CLIENT_PROFILE: ClientProfilePlaceholder = {
  accountId: 'CRX-STAGE1-PREVIEW',
  displayName: 'Stage 1 Preview User',
  contactEmail: 'preview.user@carex.example',
  jurisdiction: 'Not Specified (Stage 1)',
  accountStatus: 'Preview Account (Unverified)',
  kycStatus: 'Not Submitted',
  walletConnected: false,
  walletAddress: null,
  emailVerified: false,
};

export const CLIENT_STAGE1_NOTIFICATIONS: readonly PlatformNotification[] = [
  {
    id: 'NT-001',
    title: 'Stage 1 Client Portal Layout Active',
    detail:
      'You are viewing the Stage 1 interface structure. Live Firebase authentication and persistent account storage will be enabled in a subsequent development stage.',
    category: 'Platform',
    timestamp: 'Stage 1 Notice',
  },
  {
    id: 'NT-002',
    title: 'Wallet Ownership Policy',
    detail:
      'Future wallet connectivity will use cryptographic message signatures only. CAREX will never request private keys, seed phrases, or wallet passwords.',
    category: 'Security',
    timestamp: 'Security Standard',
  },
  {
    id: 'NT-003',
    title: 'Identity Verification Schedule',
    detail:
      'KYC verification will connect through an authorized verification provider. DigiLocker support is planned as a separate stage following API approval.',
    category: 'Verification',
    timestamp: 'Roadmap Notice',
  },
];

export const ADMIN_SUMMARY_PLACEHOLDERS = [
  { label: 'Total Registered Users', value: '1,248', note: 'Placeholder count' },
  { label: 'Active Users', value: '1,104', note: 'Placeholder count' },
  { label: 'Pending KYC Applications', value: '64', note: 'Placeholder queue' },
  { label: 'Verified Users', value: '982', note: 'Placeholder count' },
  { label: 'Rejected Applications', value: '18', note: 'Placeholder count' },
] as const;

export const INITIAL_ADMIN_USERS: readonly AdminUserPlaceholder[] = [
  {
    id: 'USR-PH-001',
    displayName: 'Placeholder Account 01',
    email: 'placeholder.01@carex.example',
    role: 'client',
    accountStatus: 'Active',
    kycStatus: 'Verified',
    walletStatus: 'Linked (Placeholder)',
    registeredDate: '2026-11-12',
  },
  {
    id: 'USR-PH-002',
    displayName: 'Placeholder Account 02',
    email: 'placeholder.02@carex.example',
    role: 'client',
    accountStatus: 'Active',
    kycStatus: 'Pending',
    walletStatus: 'Signature Pending',
    registeredDate: '2026-11-14',
  },
  {
    id: 'USR-PH-003',
    displayName: 'Placeholder Account 03',
    email: 'placeholder.03@carex.example',
    role: 'compliance_reviewer',
    accountStatus: 'Active',
    kycStatus: 'Verified',
    walletStatus: 'Unlinked',
    registeredDate: '2026-11-15',
  },
  {
    id: 'USR-PH-004',
    displayName: 'Placeholder Account 04',
    email: 'placeholder.04@carex.example',
    role: 'client',
    accountStatus: 'Restricted',
    kycStatus: 'Rejected',
    walletStatus: 'Unlinked',
    registeredDate: '2026-11-16',
  },
  {
    id: 'USR-PH-005',
    displayName: 'Placeholder Account 05',
    email: 'placeholder.05@carex.example',
    role: 'client',
    accountStatus: 'Under Review',
    kycStatus: 'Pending',
    walletStatus: 'Signature Pending',
    registeredDate: '2026-11-18',
  },
  {
    id: 'USR-PH-006',
    displayName: 'Placeholder Administrator',
    email: 'admin.preview@carex.example',
    role: 'admin',
    accountStatus: 'Active',
    kycStatus: 'Verified',
    walletStatus: 'Unlinked',
    registeredDate: '2026-11-01',
  },
];

export const INITIAL_ADMIN_KYC: readonly AdminKycPlaceholder[] = [
  {
    applicationId: 'KYC-PH-101',
    userId: 'USR-PH-002',
    applicantLabel: 'Placeholder Applicant A',
    providerChannel: 'Authorized KYC Provider (Scheduled)',
    status: 'Pending',
    submittedAt: '2026-11-19 09:14 UTC',
    reviewNote: 'Awaiting live external KYC provider webhook connection in Stage 2.',
  },
  {
    applicationId: 'KYC-PH-102',
    userId: 'USR-PH-005',
    applicantLabel: 'Placeholder Applicant B',
    providerChannel: 'DigiLocker Integration (Future Stage)',
    status: 'Pending',
    submittedAt: '2026-11-19 11:42 UTC',
    reviewNote: 'DigiLocker verification channel reserved for post-API approval stage.',
  },
  {
    applicationId: 'KYC-PH-103',
    userId: 'USR-PH-001',
    applicantLabel: 'Placeholder Applicant C',
    providerChannel: 'Authorized KYC Provider (Scheduled)',
    status: 'Verified',
    submittedAt: '2026-11-13 15:20 UTC',
    reviewNote: 'Placeholder verified state for dashboard table demonstration.',
  },
  {
    applicationId: 'KYC-PH-104',
    userId: 'USR-PH-004',
    applicantLabel: 'Placeholder Applicant D',
    providerChannel: 'Authorized KYC Provider (Scheduled)',
    status: 'Rejected',
    submittedAt: '2026-11-16 17:05 UTC',
    reviewNote: 'Placeholder rejected state for review workflow layout.',
  },
];

export const INITIAL_ADMIN_WALLETS: readonly AdminWalletPlaceholder[] = [
  {
    recordId: 'WLT-PH-201',
    userId: 'USR-PH-001',
    accountLabel: 'Placeholder Account 01',
    publicAddressPreview: '0x0000...PH01 (Placeholder Format)',
    verificationMethod: 'Cryptographic Signature (Stage 2)',
    status: 'Verified (Placeholder)',
    updatedAt: '2026-11-13 16:00 UTC',
  },
  {
    recordId: 'WLT-PH-202',
    userId: 'USR-PH-002',
    accountLabel: 'Placeholder Account 02',
    publicAddressPreview: '0x0000...PH02 (Placeholder Format)',
    verificationMethod: 'Cryptographic Signature (Stage 2)',
    status: 'Pending Signature',
    updatedAt: '2026-11-18 10:25 UTC',
  },
  {
    recordId: 'WLT-PH-203',
    userId: 'USR-PH-004',
    accountLabel: 'Placeholder Account 04',
    publicAddressPreview: '0x0000...PH04 (Placeholder Format)',
    verificationMethod: 'Cryptographic Signature (Stage 2)',
    status: 'Revoked',
    updatedAt: '2026-11-17 08:40 UTC',
  },
];

export const INITIAL_ADMIN_LOGS: readonly AdminActivityLogPlaceholder[] = [
  {
    eventId: 'LOG-PH-901',
    timestampUtc: '2026-11-20 14:22:08',
    category: 'Administration',
    actor: 'admin.preview@carex.example',
    summary: 'Viewed Stage 1 Admin Console role-based access policy summary (Placeholder).',
    outcome: 'Recorded',
  },
  {
    eventId: 'LOG-PH-902',
    timestampUtc: '2026-11-20 13:45:19',
    category: 'KYC',
    actor: 'compliance.preview@carex.example',
    summary: 'Inspected placeholder KYC queue entry KYC-PH-101.',
    outcome: 'Pending',
  },
  {
    eventId: 'LOG-PH-903',
    timestampUtc: '2026-11-20 12:10:44',
    category: 'Authentication',
    actor: 'placeholder.04@carex.example',
    summary: 'Standard client role blocked from administrative route access (RBAC demo event).',
    outcome: 'Blocked',
  },
  {
    eventId: 'LOG-PH-904',
    timestampUtc: '2026-11-19 18:04:11',
    category: 'Wallet',
    actor: 'placeholder.02@carex.example',
    summary: 'Cryptographic signature verification workflow placeholder logged.',
    outcome: 'Pending',
  },
  {
    eventId: 'LOG-PH-905',
    timestampUtc: '2026-11-19 09:30:02',
    category: 'Administration',
    actor: 'admin.preview@carex.example',
    summary: 'Updated placeholder restriction flag on account USR-PH-004.',
    outcome: 'Recorded',
  },
];
