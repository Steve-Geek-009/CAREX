import React, { useState } from 'react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { KeyValueRow, StageNotice } from '../../components/UiPrimitives';

const READINESS_ITEMS = [
  {
    id: 'email',
    label: 'Confirm account email address via authenticated sign-in',
  },
  {
    id: 'human',
    label: 'Complete independent human verification and bot protection check',
  },
  {
    id: 'gov-id',
    label: 'Prepare valid government-issued identity documentation for authorized KYC provider',
  },
  {
    id: 'digilocker',
    label: 'Optional DigiLocker pathway (available separately after formal API approval)',
  },
] as const;

export function ClientKycPage() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          KYC Verification
        </h1>
        <p className="text-sm text-slate-400">
          Identity verification architecture, current verification status, and pre-submission
          readiness checklist.
        </p>
      </div>

      <StageNotice
        title="Live KYC Provider Connection Deferred to Future Stage"
        description="CAREX does not perform simulated or fake identity verification. Live KYC submission will activate only after connecting an authorized verification provider. DigiLocker integration will be developed separately following formal API approval."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7 lg:col-span-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">Verification Status</h2>
            <StatusIndicator status="Not Submitted" size="md" />
          </div>

          <div className="mt-4">
            <KeyValueRow label="Primary KYC Channel" value="Authorized KYC Provider (Scheduled)" />
            <KeyValueRow label="DigiLocker Pathway" value="Separate Future Stage (Post API Approval)" />
            <KeyValueRow label="Human Verification" value="Independent Security Requirement" />
            <KeyValueRow label="Submitted Documents" value="None — Upload Disabled in Stage 1" />
          </div>

          <div className="mt-6 border-t border-slate-800/80 pt-5">
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-400"
            >
              Start Verification (Enabled After Provider Integration)
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7 lg:col-span-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">Readiness Checklist</h2>
            <span className="font-mono text-xs tabular-nums text-slate-400">
              {checkedIds.length} / {READINESS_ITEMS.length} reviewed
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Review the upcoming steps required once live identity verification activates. Checking
            items here tracks your personal checklist only.
          </p>

          <ul className="mt-5 space-y-3">
            {READINESS_ITEMS.map((item) => {
              const checked = checkedIds.includes(item.id);
              return (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-800/80 bg-[#050b19] px-4 py-3 text-sm text-slate-200 transition-colors hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(item.id)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-[#040814] text-blue-600 focus:ring-blue-500"
                    />
                    <span className={checked ? 'text-slate-400 line-through' : 'text-slate-200'}>
                      {item.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
