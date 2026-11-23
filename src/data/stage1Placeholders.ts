/**
 * NON-AUTH MODULE MOCKUPS & PLATFORM NOTICES
 * ---------------------------------------------------------------------------
 * Authentication identities, user directories, and activity logs are now
 * backed exclusively by real Firebase Authentication and PostgreSQL.
 *
 * The datasets below are strictly limited to unrelated KYC and Wallet mockup
 * pages scheduled for subsequent development phases.
 */

export interface PlatformNotification {
  id: string;
  title: string;
  detail: string;
  category: 'Platform' | 'Security' | 'Verification';
  timestamp: string;
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

export const CLIENT_PLATFORM_NOTIFICATIONS: readonly PlatformNotification[] = [
  {
    id: 'NT-001',
    title: 'Google Authentication Active',
    detail:
      'Your CAREX account session is verified via Firebase Google Sign-In and synchronized with the CAREX backend.',
    category: 'Platform',
    timestamp: 'Draft 1 Active',
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

export const INITIAL_ADMIN_KYC: readonly AdminKycPlaceholder[] = [
  {
    applicationId: 'KYC-PH-101',
    userId: 'USR-PH-002',
    applicantLabel: 'Placeholder Applicant A',
    providerChannel: 'Authorized KYC Provider (Scheduled)',
    status: 'Pending',
    submittedAt: '2026-11-19 09:14 UTC',
    reviewNote: 'Awaiting live external KYC provider webhook connection in a subsequent stage.',
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
