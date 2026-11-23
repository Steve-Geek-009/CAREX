import React, { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { KeyValueRow, SegmentedTabs } from '../../components/UiPrimitives';
import { useAdminData } from '../../context/AdminDataContext';
import type { AuthenticatedAccount } from '../../context/AuthContext';
import { getAccountStatusLabel, getRoleLabel } from '../../utils/rbac';
import { filterRecords } from '../../utils/validation';

function formatUtcTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

export function AdminUsersPage() {
  const { users, loading, error, refreshOverview } = useAdminData();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUid, setSelectedUid] = useState<string>('');

  const filtered = filterRecords(
    users,
    query,
    ['uid', 'displayName', 'email'],
    'accountStatus',
    statusFilter
  );

  const selectedUser: AuthenticatedAccount | undefined =
    filtered.find((u) => u.uid === selectedUid) ?? filtered[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            User Management
          </h1>
          <p className="text-sm text-slate-400">
            Directory of verified Google-authenticated CAREX accounts persisted in the platform
            database.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refreshOverview()}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-700/90 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60 whitespace-nowrap"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Directory'}</span>
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

      {/* Search & Status Filter */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800/90 bg-[#081124] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="admin-user-search" className="sr-only">
            Search registered users
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="admin-user-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by Firebase UID, name, or email..."
            className="w-full rounded-lg border border-slate-700/90 bg-[#050b19] py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <SegmentedTabs
          ariaLabel="Filter users by account status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'UNDER_REVIEW', label: 'Under Review' },
            { value: 'RESTRICTED', label: 'Restricted' },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#081124] xl:col-span-8">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400">
                <th className="px-4 py-3 font-medium">Account ID</th>
                <th className="px-4 py-3 font-medium">Verified User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                    Loading registered users...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((user) => {
                  const isSelected = selectedUser?.uid === user.uid;
                  const accountCode = `CRX-${String(user.id).padStart(6, '0')}`;
                  return (
                    <tr
                      key={user.uid}
                      className={isSelected ? 'bg-blue-600/12' : 'hover:bg-slate-800/35'}
                    >
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-400">
                        {accountCode}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-100">{user.displayName}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300">{user.role}</td>
                      <td className="px-4 py-3">
                        <StatusIndicator status={getAccountStatusLabel(user.accountStatus)} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedUid(user.uid)}
                          aria-label={`Inspect ${user.displayName}`}
                          className="rounded-md border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:border-blue-500 hover:text-white"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                    No registered accounts match the active search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Record Inspector */}
        <aside className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 xl:col-span-4">
          <h2 className="font-display text-lg font-semibold text-white">Account Inspector</h2>
          {selectedUser ? (
            <div className="mt-4">
              <div className="mb-4 flex items-center gap-3 border-b border-slate-800/70 pb-4">
                {selectedUser.photoUrl ? (
                  <img
                    src={selectedUser.photoUrl}
                    alt={`${selectedUser.displayName} avatar`}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-[#050b19] font-display text-sm font-semibold text-sky-300">
                    {selectedUser.displayName.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {selectedUser.displayName}
                  </p>
                  <p className="truncate text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <KeyValueRow
                label="Internal ID"
                value={`CRX-${String(selectedUser.id).padStart(6, '0')}`}
                mono
              />
              <KeyValueRow label="Firebase UID" value={selectedUser.uid} mono />
              <KeyValueRow label="Assigned Role" value={getRoleLabel(selectedUser.role)} />
              <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
                <span className="text-sm text-slate-400">Account Status</span>
                <StatusIndicator status={getAccountStatusLabel(selectedUser.accountStatus)} />
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
                <span className="text-sm text-slate-400">KYC Status</span>
                <StatusIndicator status={selectedUser.kycStatus} />
              </div>
              <KeyValueRow label="Created" value={formatUtcTimestamp(selectedUser.createdAt)} mono />
              <KeyValueRow
                label="Last Login"
                value={formatUtcTimestamp(selectedUser.lastLoginAt)}
                mono
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              Select a registered user record to inspect verified account metadata.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
