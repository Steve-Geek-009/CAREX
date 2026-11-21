import React, { useState } from 'react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { SegmentedTabs, StageNotice } from '../../components/UiPrimitives';
import { usePreviewState } from '../../context/PreviewRoleContext';
import { getRoleLabel } from '../../utils/rbac';

export function AdminAccountsPage() {
  const { adminUsers, updateAdminUserStatus } = usePreviewState();
  const [roleFilter, setRoleFilter] = useState('all');

  const visibleAccounts = adminUsers.filter((account) => {
    if (roleFilter === 'all') return true;
    return account.role === roleFilter;
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Account Management
        </h1>
        <p className="text-sm text-slate-400">
          Manage platform account restrictions, role assignments, and governance safeguards.
        </p>
      </div>

      <StageNotice
        title="Stage 1 Local Restriction Preview"
        description="Toggling account restriction states below updates local preview state. Production account restrictions are audited and persisted server-side."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs tabular-nums text-slate-400">
          Showing {visibleAccounts.length} of {adminUsers.length} placeholder accounts
        </p>

        <SegmentedTabs
          ariaLabel="Filter accounts by assigned role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: 'all', label: 'All Roles' },
            { value: 'client', label: 'Client Users' },
            { value: 'compliance_reviewer', label: 'Compliance' },
            { value: 'admin', label: 'Administrators' },
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#081124]">
        <table className="w-full min-w-[660px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">Account ID</th>
              <th className="px-4 py-3 font-medium">Account (Placeholder)</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Restriction Preview</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {visibleAccounts.map((account) => {
              const isRestricted = account.accountStatus === 'Restricted';
              const isAdmin = account.role === 'admin';
              return (
                <tr key={account.id} className="hover:bg-slate-800/35">
                  <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-slate-400">
                    {account.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-slate-100">{account.displayName}</p>
                    <p className="text-xs text-slate-400">{account.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-300">
                    {getRoleLabel(account.role)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusIndicator status={account.accountStatus} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {isAdmin ? (
                      <span className="text-xs text-slate-500">Protected Admin Role</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          updateAdminUserStatus(account.id, isRestricted ? 'Active' : 'Restricted')
                        }
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                          isRestricted
                            ? 'border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:text-white'
                            : 'border-rose-500/40 text-rose-300 hover:border-rose-400 hover:text-white'
                        }`}
                      >
                        {isRestricted ? 'Lift Restriction' : 'Restrict Account'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
