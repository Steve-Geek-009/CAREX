import React from 'react';
import { AppLink } from '../../components/AppLink';
import { StatusIndicator } from '../../components/StatusIndicator';
import {
  EmptyStatePanel,
  KeyValueRow,
  StageNotice,
} from '../../components/UiPrimitives';
import { useAuth } from '../../context/AuthContext';
import { usePreviewState } from '../../context/PreviewRoleContext';
import { CLIENT_STAGE1_NOTIFICATIONS } from '../../data/stage1Placeholders';

export function ClientDashboardPage() {
  const { account, userLogs } = useAuth();
  const { clientProfile } = usePreviewState();

  const activeName = account?.displayName ?? clientProfile.displayName;
  const activeEmail = account?.email ?? clientProfile.contactEmail;
  const activeJurisdiction = account?.jurisdiction ?? clientProfile.jurisdiction;
  const activeAccountId = account
    ? `CRX-${String(account.id).padStart(6, '0')}`
    : clientProfile.accountId;
  const activeAccountStatus = account?.accountStatus ?? clientProfile.accountStatus;
  const activeKycStatus = account?.kycStatus ?? clientProfile.kycStatus;
  const activeWalletStatus = account?.walletAddress ? 'Connected' : 'No Wallet Connected';
  const activeWalletAddress = account?.walletAddress ?? clientProfile.walletAddress;

  const verificationRows = [
    {
      module: 'Account Authentication',
      channel: account ? 'Google Sign-In' : 'Preview Layout',
      status: account ? 'Verified' : 'Pending',
      actionTo: '/client/settings',
      actionLabel: 'Settings',
    },
    {
      module: 'KYC Identity Verification',
      channel: 'Authorized KYC Provider (Scheduled)',
      status: activeKycStatus,
      actionTo: '/client/kyc',
      actionLabel: 'Review KYC',
    },
    {
      module: 'DigiLocker Pathway',
      channel: 'Separate Stage (Post API Approval)',
      status: 'Scheduled',
      actionTo: '/client/kyc',
      actionLabel: 'Details',
    },
    {
      module: 'Web3 Wallet Ownership',
      channel: 'Cryptographic Signature Only',
      status: activeWalletAddress ? 'Verified' : 'Unlinked',
      actionTo: '/client/wallet',
      actionLabel: 'Wallet',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Client Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Overview of your account profile, verification status, connected wallet, recent activity,
          and platform notices.
        </p>
      </div>

      {!account && (
        <StageNotice
          title="Stage 1 Client Dashboard Layout — Placeholder Account Context"
          description="Sign in with Google to save profile and settings changes to your account. CAREX does not display fabricated cryptocurrency balances or simulated transactions."
          actionLabel="Sign In with Google"
          actionTo="/login"
        />
      )}

      {/* Key Status Summary Strip */}
      <section aria-label="Account status overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-5">
          <p className="text-xs text-slate-400">Account Status</p>
          <div className="mt-2.5">
            <StatusIndicator status={activeAccountStatus} size="md" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {account ? 'Verified session active' : 'Sign in to activate persistent profile'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-5">
          <p className="text-xs text-slate-400">KYC Verification Status</p>
          <div className="mt-2.5">
            <StatusIndicator status={activeKycStatus} size="md" />
          </div>
          <AppLink
            to="/client/kyc"
            className="mt-2 inline-block text-xs font-medium text-sky-400 hover:text-sky-300"
          >
            Review KYC requirements
          </AppLink>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-5">
          <p className="text-xs text-slate-400">Connected Wallet</p>
          <div className="mt-2.5">
            <StatusIndicator status={activeWalletStatus} size="md" />
          </div>
          <AppLink
            to="/client/wallet"
            className="mt-2 inline-block text-xs font-medium text-sky-400 hover:text-sky-300"
          >
            Open Wallet Management
          </AppLink>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-5">
          <p className="text-xs text-slate-400">Wallet Address</p>
          <p className="mt-2.5 font-mono text-sm tabular-nums text-slate-300">
            {activeWalletAddress ?? 'Not Linked'}
          </p>
          <p className="mt-2 text-xs text-slate-500">Cryptographic signature required</p>
        </div>
      </section>

      {/* Client Verification & Readiness Table with shared StatusIndicator */}
      <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              Account Verification &amp; Readiness
            </h2>
            <p className="text-xs text-slate-400">
              Current status across authentication, identity verification, and non-custodial wallet
              modules.
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium">Module</th>
                <th className="py-2.5 pr-4 font-medium">Verification Channel</th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
                <th className="py-2.5 text-right font-medium">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {verificationRows.map((row) => (
                <tr key={row.module} className="hover:bg-slate-800/30">
                  <td className="py-3 pr-4 font-medium text-slate-100">{row.module}</td>
                  <td className="py-3 pr-4 text-xs text-slate-400">{row.channel}</td>
                  <td className="py-3 pr-4">
                    <StatusIndicator status={row.status} />
                  </td>
                  <td className="py-3 text-right">
                    <AppLink
                      to={row.actionTo}
                      className="text-xs font-medium text-sky-400 hover:text-sky-300"
                    >
                      {row.actionLabel}
                    </AppLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Two-Column Content: Account Info + Notifications */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 lg:col-span-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">User Information</h2>
            <AppLink
              to="/client/profile"
              className="text-xs font-medium text-sky-400 hover:text-sky-300"
            >
              Edit Profile
            </AppLink>
          </div>
          <div className="mt-4">
            <KeyValueRow
              label={account ? 'Display Name' : 'Display Name (Placeholder)'}
              value={activeName}
            />
            <KeyValueRow label="Contact Email" value={activeEmail} />
            <KeyValueRow label="Account Identifier" value={activeAccountId} mono />
            <KeyValueRow label="Jurisdiction" value={activeJurisdiction} />
          </div>
        </section>

        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 lg:col-span-6">
          <h2 className="font-display text-lg font-semibold text-white">Notifications</h2>
          <ul className="mt-4 divide-y divide-slate-800/80">
            {CLIENT_STAGE1_NOTIFICATIONS.map((item) => (
              <li key={item.id} className="py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="font-medium text-sky-400">{item.category}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-100">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Account Activity & Honest Empty State for Transaction History */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Account Activity</h2>
          {userLogs.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#081124] p-4">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 pr-3 font-medium">Event</th>
                    <th className="py-2 pr-3 font-medium">Summary</th>
                    <th className="py-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {userLogs.slice(0, 5).map((entry) => (
                    <tr key={entry.id}>
                      <td className="py-2.5 pr-3 font-mono tabular-nums text-slate-400">
                        {entry.eventCode}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-200">{entry.summary}</td>
                      <td className="py-2.5 text-right">
                        <StatusIndicator status={entry.outcome} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyStatePanel
              title="No Recorded Account Activity"
              description="Security sign-ins, profile updates, and verification milestones will appear here once you sign in with your CAREX account."
              metaNote="Empty state · Sign in to record account activity"
              actionLabel="View Account Settings"
              actionTo="/client/settings"
            />
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Transaction History</h2>
          <EmptyStatePanel
            title="No Transactions Available"
            description="No blockchain transactions or CRX balances are displayed at this stage. Live transaction records will appear only after wallet connectivity and finalized blockchain integration."
            metaNote="Zero fabricated balances · Protocol integration scheduled"
            actionLabel="Open Transaction History"
            actionTo="/client/transactions"
          />
        </section>
      </div>
    </div>
  );
}
