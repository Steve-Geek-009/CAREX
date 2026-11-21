import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { SegmentedTabs, StageNotice } from '../../components/UiPrimitives';
import { INITIAL_ADMIN_WALLETS } from '../../data/stage1Placeholders';
import { filterRecords } from '../../utils/validation';

export function AdminWalletsPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = filterRecords(
    INITIAL_ADMIN_WALLETS,
    query,
    ['recordId', 'userId', 'accountLabel', 'publicAddressPreview'],
    'status',
    statusFilter
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Wallet Management
        </h1>
        <p className="text-sm text-slate-400">
          Administrative audit registry for public wallet address bindings and cryptographic
          signature status.
        </p>
      </div>

      <StageNotice
        title="Placeholder Wallet Registry — Public Addresses Only"
        description="CAREX stores only verified public wallet addresses and signature metadata. Private keys, seed phrases, and wallet passwords are never collected. Live blockchain verification activates in a future stage."
      />

      <div className="flex flex-col gap-4 rounded-xl border border-slate-800/90 bg-[#081124] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="admin-wallet-search" className="sr-only">
            Search placeholder wallet records
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="admin-wallet-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search record ID, user, or address..."
            className="w-full rounded-lg border border-slate-700/90 bg-[#050b19] py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <SegmentedTabs
          ariaLabel="Filter wallet records by status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'Verified (Placeholder)', label: 'Verified' },
            { value: 'Pending Signature', label: 'Pending' },
            { value: 'Revoked', label: 'Revoked' },
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#081124]">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">Record ID</th>
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium">Public Address (Placeholder)</th>
              <th className="px-4 py-3 font-medium">Verification Method</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Updated (UTC)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.recordId} className="hover:bg-slate-800/35">
                  <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-slate-400">
                    {item.recordId}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-slate-100">{item.accountLabel}</p>
                    <p className="font-mono text-xs tabular-nums text-slate-400">{item.userId}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-sky-300">
                    {item.publicAddressPreview}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-300">{item.verificationMethod}</td>
                  <td className="px-4 py-3.5">
                    <StatusIndicator status={item.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs tabular-nums text-slate-400">
                    {item.updatedAt}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  No placeholder wallet records match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
