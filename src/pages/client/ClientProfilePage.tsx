import React, { useEffect, useState } from 'react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { KeyValueRow } from '../../components/UiPrimitives';
import { useAuth } from '../../context/AuthContext';
import { getAccountStatusLabel, getRoleLabel } from '../../utils/rbac';
import {
  validateProfileForm,
  type ProfileFormValues,
  type ValidationErrors,
} from '../../utils/validation';

function formatUtcTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

export function ClientProfilePage() {
  const { account, saveProfileToServer } = useAuth();
  const [form, setForm] = useState<ProfileFormValues>({
    displayName: account?.displayName ?? '',
    contactEmail: account?.email ?? '',
    jurisdiction: account?.jurisdiction ?? '',
  });
  const [errors, setErrors] = useState<ValidationErrors<ProfileFormValues>>({});
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (account) {
      setForm({
        displayName: account.displayName,
        contactEmail: account.email,
        jurisdiction: account.jurisdiction,
      });
    }
  }, [account]);

  if (!account) return null;

  const isReadOnly = account.accountStatus !== 'ACTIVE';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) {
      setSaveError('Profile modifications are disabled while your account is under review.');
      return;
    }

    const validation = validateProfileForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setSavedNotice(null);
      return;
    }

    setSaveError(null);
    setSaving(true);
    try {
      await saveProfileToServer({
        displayName: form.displayName.trim(),
        jurisdiction: form.jurisdiction.trim(),
      });
      setSavedNotice('Account profile saved.');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          User Profile
        </h1>
        <p className="text-sm text-slate-400">
          Review and update your verified CAREX account profile information.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7 lg:col-span-7">
          <div className="flex items-center gap-4 border-b border-slate-800/80 pb-5">
            {account.photoUrl ? (
              <img
                src={account.photoUrl}
                alt={`${account.displayName} profile`}
                referrerPolicy="no-referrer"
                className="h-12 w-12 rounded-full border border-slate-700 object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-[#050b19] font-display text-base font-semibold text-sky-300">
                {account.displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="font-display text-lg font-semibold text-white">Profile Details</h2>
              <p className="text-xs text-slate-400">
                Verified identity linked via Google Authentication
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} noValidate className="mt-5 space-y-5">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-slate-200">
                Display Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={form.displayName}
                disabled={isReadOnly}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, displayName: e.target.value }));
                  setSavedNotice(null);
                }}
                className="mt-2 w-full rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
              {errors.displayName && (
                <p role="alert" className="mt-1.5 text-xs text-rose-400">
                  {errors.displayName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-slate-200">
                Verified Email Address
              </label>
              <input
                id="profile-email"
                type="email"
                value={form.contactEmail}
                readOnly
                className="mt-2 w-full cursor-not-allowed rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm text-slate-400 focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Email is synchronized directly from your verified Google account.
              </p>
            </div>

            <div>
              <label
                htmlFor="profile-jurisdiction"
                className="block text-sm font-medium text-slate-200"
              >
                Country / Jurisdiction
              </label>
              <input
                id="profile-jurisdiction"
                type="text"
                value={form.jurisdiction}
                disabled={isReadOnly}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, jurisdiction: e.target.value }));
                  setSavedNotice(null);
                }}
                className="mt-2 w-full rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
              {errors.jurisdiction && (
                <p role="alert" className="mt-1.5 text-xs text-rose-400">
                  {errors.jurisdiction}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving || isReadOnly}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? 'Saving...'
                  : isReadOnly
                    ? 'Read-Only (Under Review)'
                    : 'Save Account Profile'}
              </button>
              {savedNotice && (
                <span role="status" className="text-sm font-medium text-cyan-300">
                  {savedNotice}
                </span>
              )}
              {saveError && (
                <span role="alert" className="text-sm font-medium text-rose-400">
                  {saveError}
                </span>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7 lg:col-span-5">
          <h2 className="font-display text-lg font-semibold text-white">Account Metadata</h2>
          <div className="mt-4">
            <KeyValueRow
              label="Account Identifier"
              value={`CRX-${String(account.id).padStart(6, '0')}`}
              mono
            />
            <KeyValueRow label="Assigned Role" value={getRoleLabel(account.role)} />
            <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
              <span className="text-sm text-slate-400">Account Status</span>
              <StatusIndicator status={getAccountStatusLabel(account.accountStatus)} />
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
              <span className="text-sm text-slate-400">Email Verification</span>
              <StatusIndicator status="Verified" />
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
              <span className="text-sm text-slate-400">KYC Status</span>
              <StatusIndicator status={account.kycStatus} />
            </div>
            <KeyValueRow label="Created" value={formatUtcTimestamp(account.createdAt)} mono />
            <KeyValueRow label="Last Sign-In" value={formatUtcTimestamp(account.lastLoginAt)} mono />
          </div>
        </section>
      </div>
    </div>
  );
}
