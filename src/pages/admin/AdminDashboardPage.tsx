import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { StatusIndicator } from '../../components/StatusIndicator';
import { StageNotice } from '../../components/UiPrimitives';
import {
  ADMIN_SUMMARY_PLACEHOLDERS,
  INITIAL_ADMIN_LOGS,
} from '../../data/stage1Placeholders';

export function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Administrative overview of platform accounts, KYC queues, wallet verification records,
          and system activity monitoring.
        </p>
      </div>

      <StageNotice
        title="Placeholder Data Active — Administrative Layout Preview"
        description="All figures and log entries displayed below are clearly labelled Stage 1 placeholder data for interface verification."
      />

      {/* 5 Core Administrative Metrics (Tabular Numerals) */}
      <section aria-label="Administrative summary metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ADMIN_SUMMARY_PLACEHOLDERS.map((metric) => (
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
              Review pending, verified, and rejected placeholder KYC submissions across authorized
              provider channels.
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
              Inspect user roles, manage account restriction states, and review administrative
              access policies.
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
              Audit placeholder public wallet links and cryptographic signature verification states.
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

      {/* Recent Placeholder Activity Preview */}
      <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              Recent Activity Monitoring (Placeholder)
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Illustrative audit log layout with CAREX status indicators.
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
              {INITIAL_ADMIN_LOGS.slice(0, 4).map((entry) => (
                <tr key={entry.eventId} className="hover:bg-slate-800/30">
                  <td className="py-3 pr-4 font-mono text-xs tabular-nums text-slate-400">
                    {entry.timestampUtc}
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-300">{entry.category}</td>
                  <td className="py-3 pr-4 text-xs text-slate-200">{entry.summary}</td>
                  <td className="py-3 text-right">
                    <StatusIndicator status={entry.outcome} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
