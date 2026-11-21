import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { SegmentedTabs, StageNotice } from '../../components/UiPrimitives';
import { INITIAL_ADMIN_LOGS } from '../../data/stage1Placeholders';
import { filterRecords } from '../../utils/validation';

export function AdminLogsPage() {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = filterRecords(
    INITIAL_ADMIN_LOGS,
    query,
    ['eventId', 'actor', 'summary', 'category'],
    'category',
    categoryFilter
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Activity Logs
        </h1>
        <p className="text-sm text-slate-400">
          Chronological audit trail of administrative operations, RBAC blocks, and account events.
        </p>
      </div>

      <StageNotice
        title="Stage 1 Placeholder Audit Log"
        description="Entries below demonstrate the CAREX audit log structure using placeholder timestamps and CAREX status indicators."
      />

      <div className="flex flex-col gap-4 rounded-xl border border-slate-800/90 bg-[#081124] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="admin-logs-search" className="sr-only">
            Search activity logs
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="admin-logs-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by event ID, actor, or summary..."
            className="w-full rounded-lg border border-slate-700/90 bg-[#050b19] py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <SegmentedTabs
          ariaLabel="Filter activity logs by category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: 'all', label: 'All Events' },
            { value: 'Authentication', label: 'Auth' },
            { value: 'KYC', label: 'KYC' },
            { value: 'Wallet', label: 'Wallet' },
            { value: 'Administration', label: 'Admin' },
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#081124]">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">Event ID</th>
              <th className="px-4 py-3 font-medium">Timestamp (UTC)</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Summary</th>
              <th className="px-4 py-3 text-right font-medium">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filtered.length > 0 ? (
              filtered.map((entry) => (
                <tr key={entry.eventId} className="hover:bg-slate-800/35">
                  <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-slate-400">
                    {entry.eventId}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-slate-300">
                    {entry.timestampUtc}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-sky-400">{entry.category}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{entry.actor}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-200">{entry.summary}</td>
                  <td className="px-4 py-3.5 text-right">
                    <StatusIndicator status={entry.outcome} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  No placeholder activity logs match the active search or category filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
