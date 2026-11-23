import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { StatusIndicator } from '../../components/StatusIndicator';
import {
  KeyValueRow,
  SegmentedTabs,
  StageNotice,
} from '../../components/UiPrimitives';
import {
  INITIAL_ADMIN_KYC,
  type AdminKycPlaceholder,
} from '../../data/stage1Placeholders';
import { filterRecords } from '../../utils/validation';

export function AdminKycPage() {
  const adminKycQueue = INITIAL_ADMIN_KYC;
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppId, setSelectedAppId] = useState<string>(
    adminKycQueue[0]?.applicationId ?? ''
  );

  const filtered = filterRecords(
    adminKycQueue,
    query,
    ['applicationId', 'userId', 'applicantLabel', 'providerChannel'],
    'status',
    statusFilter
  );

  const selectedApp: AdminKycPlaceholder | undefined =
    filtered.find((item) => item.applicationId === selectedAppId) ?? filtered[0];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          KYC Management
        </h1>
        <p className="text-sm text-slate-400">
          Review queue for identity verification submissions across authorized KYC providers and
          future DigiLocker pathways.
        </p>
      </div>

      <StageNotice
        title="Placeholder KYC Queue — External Provider Integration Deferred"
        description="No live identity documents or DigiLocker checks are active in Stage 1. Approval and rejection actions remain disabled until an authorized KYC provider is connected."
      />

      <div className="flex flex-col gap-4 rounded-xl border border-slate-800/90 bg-[#081124] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="admin-kyc-search" className="sr-only">
            Search placeholder KYC applications
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="admin-kyc-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by application ID or applicant..."
            className="w-full rounded-lg border border-slate-700/90 bg-[#050b19] py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <SegmentedTabs
          ariaLabel="Filter KYC queue by status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Verified', label: 'Verified' },
            { value: 'Rejected', label: 'Rejected' },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#081124] xl:col-span-8">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400">
                <th className="px-4 py-3 font-medium">Application ID</th>
                <th className="px-4 py-3 font-medium">Applicant (Placeholder)</th>
                <th className="px-4 py-3 font-medium">Channel</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.length > 0 ? (
                filtered.map((app) => {
                  const isSelected = selectedApp?.applicationId === app.applicationId;
                  return (
                    <tr
                      key={app.applicationId}
                      className={isSelected ? 'bg-blue-600/12' : 'hover:bg-slate-800/35'}
                    >
                      <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-400">
                        {app.applicationId}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-100">{app.applicantLabel}</p>
                        <p className="font-mono text-xs tabular-nums text-slate-400">
                          {app.userId}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300">{app.providerChannel}</td>
                      <td className="px-4 py-3">
                        <StatusIndicator status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAppId(app.applicationId)}
                          aria-label={`Inspect ${app.applicationId}`}
                          className="rounded-md border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:border-blue-500 hover:text-white"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                    No placeholder KYC applications match the active filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <aside className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 xl:col-span-4">
          <h2 className="font-display text-lg font-semibold text-white">Application Review</h2>
          {selectedApp ? (
            <div className="mt-4 space-y-4">
              <div>
                <KeyValueRow label="Application ID" value={selectedApp.applicationId} mono />
                <KeyValueRow label="Account ID" value={selectedApp.userId} mono />
                <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
                  <span className="text-sm text-slate-400">Status</span>
                  <StatusIndicator status={selectedApp.status} />
                </div>
                <KeyValueRow label="Submitted (UTC)" value={selectedApp.submittedAt} mono />
              </div>
              <div className="rounded-lg border border-slate-800 bg-[#050b19] p-3.5 text-xs leading-relaxed text-slate-400">
                <p className="font-medium text-slate-200">Stage 1 Review Note</p>
                <p className="mt-1">{selectedApp.reviewNote}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-500"
                >
                  Approve (Stage 4)
                </button>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-500"
                >
                  Reject (Stage 4)
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              Select a placeholder KYC record to inspect review notes.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
