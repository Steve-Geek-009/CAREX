import React, { useEffect, useState } from 'react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { KeyValueRow, StageNotice } from '../../components/UiPrimitives';
import { useAuth } from '../../context/AuthContext';
import { usePreviewState } from '../../context/PreviewRoleContext';
import {
  validateProfileForm,
  type ProfileFormValues,
  type ValidationErrors,
} from '../../utils/validation';

export function ClientProfilePage() {
  const { account, saveProfileToServer } = useAuth();
  const { clientProfile, updateClientProfile } = usePreviewState();
  const [form, setForm] = useState<ProfileFormValues>({
    displayName: account?.displayName ?? clientProfile.displayName,
    contactEmail: account?.email ?? clientProfile.contactEmail,
    jurisdiction: account?.jurisdiction ?? clientProfile.jurisdiction,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateProfileForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setSavedNotice(null);
      return;
    }

    setSaveError(null);
    if (account) {
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
      return;
    }

    updateClientProfile({
      displayName: form.displayName.trim(),
      contactEmail: form.contactEmail.trim(),
      jurisdiction: form.jurisdiction.trim(),
    });
    setSavedNotice('Preview profile updated locally.');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          User Profile
        </h1>
        <p className="text-sm text-slate-400">
          Review and update your CAREX account profile information.
        </p>
      </div>

      {!account && (
        <StageNotice
          title="Local UI Preview Mode"
          description="Sign in with Google to persist profile updates to your CAREX account. Without signing in, edits update this browser session only."
          actionLabel="Sign In"
          actionTo="/login"
        />
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7 lg:col-span-7">
          <h2 className="font-display text-lg font-semibold text-white">Profile Details</h2>
          <form onSubmit={handleSave} noValidate className="mt-5 space-y-5">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-slate-200">
                Display Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={form.displayName}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, displayName: e.target.value }));
                  setSavedNotice(null);
                }}
                className="mt-2 w-full rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
              {errors.displayName && (
                <p role="alert" className="mt-1.5 text-xs text-rose-400">
                  {errors.displayName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-slate-200">
                Contact Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={form.contactEmail}
                readOnly={Boolean(account)}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, contactEmail: e.target.value }));
                  setSavedNotice(null);
                }}
                className={`mt-2 w-full rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none ${
                  account ? 'text-slate-400 cursor-not-allowed' : 'text-white'
                }`}
              />
              {errors.contactEmail && (
                <p role="alert" className="mt-1.5 text-xs text-rose-400">
                  {errors.contactEmail}
                </p>
              )}
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
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, jurisdiction: e.target.value }));
                  setSavedNotice(null);
                }}
                className="mt-2 w-full rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
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
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
              >
                {saving
                  ? 'Saving...'
                  : account
                    ? 'Save Account Profile'
                    : 'Save Preview Changes'}
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
              value={account ? `CRX-${String(account.id).padStart(6, '0')}` : clientProfile.accountId}
              mono
            />
            <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
              <span className="text-sm text-slate-400">Account Status</span>
              <StatusIndicator status={account?.accountStatus ?? clientProfile.accountStatus} />
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
              <span className="text-sm text-slate-400">Email Verification</span>
              <StatusIndicator status={account ? 'Verified' : 'Pending'} />
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-sm text-slate-400">KYC Status</span>
              <StatusIndicator status={account?.kycStatus ?? clientProfile.kycStatus} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
