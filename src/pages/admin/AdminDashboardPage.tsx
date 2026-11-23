import React from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { StatusIndicator } from '../../components/StatusIndicator';
import { useAdminData } from '../../context/AdminDataContext';

function formatUtcTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

export function AdminDashboardPage() {
  const { overview, activityLogs, loading, error, refreshOverview } = useAdminData();

  const metrics = [
    {
      label: 'Total Registered Users',
      value: overview ? String(overview.metrics.totalUsers) : '—',
      note: 'Verified Google accounts',
    },
    {
      label: 'Active Users',
      value: overview ? String(overview.metrics.activeUsers) : '—',
      note: 'Full portal access',
    },
    {
      label: 'Under Review',
      value: overview ? String(overview.metrics.underReviewUsers) : '—',
      note: 'Read-only policy',
    },
    {
      label: 'Restricted Accounts',
      value: overview ? String(overview.metrics.restrictedUsers) : '—',
      note: 'Blocked server-side',
    },
    {
      label: 'Administrators',
      value: overview ? String(overview.metrics.adminUsers) : '—',
      note: 'Verified ADMIN role',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Live administrative overview of authenticated CAREX accounts, status governance, and
            security activity logs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refreshOverview()}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-700/90 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60 whitespace-nowrap"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-300"
        >
          {error}
        </div>
      )}

      {/* 5 Live Administrative Metrics (Tabular Numerals) */}
      <section aria-label="Administrative summary metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-slate-800/90 bg-[#081124] p-5"
          >
            <p className="text-xs text-slate-400">{metric.label}</p>
            <p className="mt-2 font-mono text-2xl font-medium tabular-nums text-white">
              {metric.value}
            </p>
            <p className="mt-1.5 text-[11px] text-slate-500">{metric.note}</p>
          </div>
        ))}
      </section>

      {/* Operational Queues Quick Navigation */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#081124] p-6">
          <div>
            <p className="text-xs text-sky-400">Compliance Queue</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-white">KYC Management</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Review upcoming KYC submission workflows across authorized provider channels.
            </p>
          </div>
          <AppLink
            to="/admin/kyc"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sky-300 hover:text-white"
          >
            <span>Open KYC Queue</span>
            <ArrowRight className="h-4 w-4" />
          </AppLink>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#081124] p-6">
          <div>
            <p className="text-xs text-sky-400">Account Governance</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-white">
              Account Restrictions
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Inspect verified user roles and manage ACTIVE, UNDER_REVIEW, and RESTRICTED states
              server-side.
            </p>
          </div>
          <AppLink
            to="/admin/accounts"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sky-300 hover:text-white"
          >
            <span>Open Account Management</span>
            <ArrowRight className="h-4 w-4" />
          </AppLink>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#081124] p-6">
          <div>
            <p className="text-xs text-sky-400">Non-Custodial Registry</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-white">
              Wallet Management
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Inspect scheduled public wallet links and cryptographic signature verification layout.
            </p>
          </div>
          <AppLink
            to="/admin/wallets"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sky-300 hover:text-white"
          >
            <span>Open Wallet Registry</span>
            <ArrowRight className="h-4 w-4" />
          </AppLink>
        </div>
      </section>

      {/* Live Recent Activity Monitoring */}
      <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              Recent Activity Monitoring
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Recorded authentication, governance, and access-control audit events.
            </p>
          </div>
          <AppLink
            to="/admin/logs"
            className="text-xs font-medium text-sky-400 hover:text-sky-300 whitespace-nowrap"
          >
            View All Logs
          </AppLink>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium">Timestamp (UTC)</th>
                <th className="py-2.5 pr-4 font-medium">Category</th>
                <th className="py-2.5 pr-4 font-medium">Summary</th>
                <th className="py-2.5 text-right font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {loading && activityLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-slate-400">
                    Loading activity records...
                  </td>
                </tr>
              ) : activityLogs.length > 0 ? (
                activityLogs.slice(0, 6).map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/30">
                    <td className="py-3 pr-4 font-mono text-xs tabular-nums text-slate-400">
                      {formatUtcTimestamp(entry.createdAt)}
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-300">{entry.category}</td>
                    <td className="py-3 pr-4 text-xs text-slate-200">{entry.summary}</td>
                    <td className="py-3 text-right">
                      <StatusIndicator status={entry.outcome} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-slate-400">
                    No activity logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
