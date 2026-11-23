import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { SegmentedTabs } from '../../components/UiPrimitives';
import { useAdminData } from '../../context/AdminDataContext';
import { getAccountStatusLabel, getRoleLabel, type AccountStatus } from '../../utils/rbac';

const STATUS_ACTIONS: readonly { value: AccountStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'RESTRICTED', label: 'Restricted' },
];

export function AdminAccountsPage() {
  const { users, loading, error, mutatingUid, refreshOverview, changeUserStatus } = useAdminData();
  const [roleFilter, setRoleFilter] = useState('all');

  const visibleAccounts = users.filter((account) => {
    if (roleFilter === 'all') return true;
    return account.role === roleFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Account Management
          </h1>
          <p className="text-sm text-slate-400">
            Enforce server-side ACTIVE, UNDER_REVIEW (read-only), and RESTRICTED (blocked) account
            policies on verified CAREX accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refreshOverview()}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-700/90 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60 whitespace-nowrap"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Accounts'}</span>
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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs tabular-nums text-slate-400">
          Showing {visibleAccounts.length} of {users.length} registered accounts
        </p>

        <SegmentedTabs
          ariaLabel="Filter accounts by assigned role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: 'all', label: 'All Roles' },
            { value: 'CLIENT', label: 'Clients' },
            { value: 'ADMIN', label: 'Administrators' },
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#081124]">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">Account ID</th>
              <th className="px-4 py-3 font-medium">Verified Account</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Account Policy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  Loading registered accounts...
                </td>
              </tr>
            ) : visibleAccounts.length > 0 ? (
              visibleAccounts.map((account) => {
                const isAdmin = account.role === 'ADMIN';
                const isUpdating = mutatingUid === account.uid;
                return (
                  <tr key={account.uid} className="hover:bg-slate-800/35">
                    <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-slate-400">
                      CRX-{String(account.id).padStart(6, '0')}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-slate-100">{account.displayName}</p>
                      <p className="text-xs text-slate-400">{account.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-300">
                      {getRoleLabel(account.role)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusIndicator status={getAccountStatusLabel(account.accountStatus)} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {isAdmin ? (
                        <span className="text-xs text-slate-500">Protected ADMIN Role</span>
                      ) : (
                        <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                          {STATUS_ACTIONS.map((opt) => {
                            const active = account.accountStatus === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                disabled={active || isUpdating}
                                onClick={() => void changeUserStatus(account.uid, opt.value)}
                                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap disabled:cursor-not-allowed ${
                                  active
                                    ? 'border-blue-500/60 bg-blue-600/20 text-blue-200'
                                    : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white disabled:opacity-50'
                                }`}
                              >
                                {isUpdating && !active ? '...' : opt.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  No registered accounts match the active role filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
