import React, { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { SegmentedTabs } from '../../components/UiPrimitives';
import { useAdminData } from '../../context/AdminDataContext';
import { filterRecords } from '../../utils/validation';

function formatUtcTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

export function AdminLogsPage() {
  const { activityLogs, loading, error, refreshOverview } = useAdminData();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = filterRecords(
    activityLogs,
    query,
    ['eventCode', 'actorEmail', 'summary', 'category'],
    'category',
    categoryFilter
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Activity Logs
          </h1>
          <p className="text-sm text-slate-400">
            Chronological audit trail of verified sign-ins, administrative status updates, and
            blocked access attempts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refreshOverview()}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-700/90 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60 whitespace-nowrap"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Logs'}</span>
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
            {loading && activityLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  Loading audit logs...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-800/35">
                  <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-slate-400">
                    {entry.eventCode}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs tabular-nums text-slate-300">
                    {formatUtcTimestamp(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-sky-400">{entry.category}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-400">
                    {entry.actorEmail}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-200">{entry.summary}</td>
                  <td className="px-4 py-3.5 text-right">
                    <StatusIndicator status={entry.outcome} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  No recorded activity logs match the active search or category filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
