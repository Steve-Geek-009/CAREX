import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { StatusIndicator } from '../../components/StatusIndicator';
import {
  KeyValueRow,
  SegmentedTabs,
  StageNotice,
} from '../../components/UiPrimitives';
import { usePreviewState } from '../../context/PreviewRoleContext';
import type { AdminUserPlaceholder } from '../../data/stage1Placeholders';
import { getRoleLabel } from '../../utils/rbac';
import { filterRecords } from '../../utils/validation';

export function AdminUsersPage() {
  const { adminUsers } = usePreviewState();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState<string>(adminUsers[0]?.id ?? '');

  const filtered = filterRecords(
    adminUsers,
    query,
    ['id', 'displayName', 'email'],
    'accountStatus',
    statusFilter
  );

  const selectedUser: AdminUserPlaceholder | undefined =
    filtered.find((u) => u.id === selectedUserId) ?? filtered[0];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          User Management
        </h1>
        <p className="text-sm text-slate-400">
          Directory of registered CAREX accounts with KYC verification and wallet link visibility.
        </p>
      </div>

      <StageNotice
        title="Stage 1 Placeholder User Directory"
        description="The rows below represent clearly labelled placeholder accounts for administrative layout review."
      />

      {/* Search & Status Filter */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800/90 bg-[#081124] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="admin-user-search" className="sr-only">
            Search placeholder users
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="admin-user-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by ID, label, or email..."
            className="w-full rounded-lg border border-slate-700/90 bg-[#050b19] py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <SegmentedTabs
          ariaLabel="Filter users by account status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'Active', label: 'Active' },
            { value: 'Under Review', label: 'Under Review' },
            { value: 'Restricted', label: 'Restricted' },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#081124] xl:col-span-8">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400">
                <th className="px-4 py-3 font-medium">User ID</th>
                <th className="px-4 py-3 font-medium">Account (Placeholder)</th>
                <th className="px-4 py-3 font-medium">KYC</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.length > 0 ? (
                filtered.map((user) => {
                  const isSelected = selectedUser?.id === user.id;
                  return (
                    <tr
                      key={user.id}
                      className={isSelected ? 'bg-blue-600/12' : 'hover:bg-slate-800/35'}
                    >
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-400">
                        {user.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-100">{user.displayName}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusIndicator status={user.kycStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusIndicator status={user.accountStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedUserId(user.id)}
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
                    No placeholder accounts match the active search or status filter.
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
              <KeyValueRow label="Identifier" value={selectedUser.id} mono />
              <KeyValueRow label="Label" value={selectedUser.displayName} />
              <KeyValueRow label="Email" value={selectedUser.email} />
              <KeyValueRow label="Assigned Role" value={getRoleLabel(selectedUser.role)} />
              <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
                <span className="text-sm text-slate-400">Account Status</span>
                <StatusIndicator status={selectedUser.accountStatus} />
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
                <span className="text-sm text-slate-400">KYC Status</span>
                <StatusIndicator status={selectedUser.kycStatus} />
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
                <span className="text-sm text-slate-400">Wallet Link</span>
                <StatusIndicator status={selectedUser.walletStatus} />
              </div>
              <KeyValueRow label="Registered (Placeholder)" value={selectedUser.registeredDate} mono />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              Select a placeholder user record to inspect account metadata.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
