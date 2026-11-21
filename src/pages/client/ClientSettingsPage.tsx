import React, { useState } from 'react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { KeyValueRow, StageNotice } from '../../components/UiPrimitives';
import { useAuth } from '../../context/AuthContext';
import { usePreviewState } from '../../context/PreviewRoleContext';

export function ClientSettingsPage() {
  const { account, saveSettingsToServer } = useAuth();
  const { notificationPrefs, toggleNotificationPref } = usePreviewState();
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const activePrefs = account
    ? {
        securityAlerts: account.notifySecurity,
        kycUpdates: account.notifyKyc,
        platformNotices: account.notifyPlatform,
      }
    : notificationPrefs;

  const handleToggle = async (key: 'securityAlerts' | 'kycUpdates' | 'platformNotices') => {
    setSettingsError(null);
    if (account) {
      const next = { ...activePrefs, [key]: !activePrefs[key] };
      try {
        await saveSettingsToServer({
          notifySecurity: next.securityAlerts,
          notifyKyc: next.kycUpdates,
          notifyPlatform: next.platformNotices,
        });
      } catch (err) {
        setSettingsError(err instanceof Error ? err.message : 'Unable to save settings.');
      }
      return;
    }
    toggleNotificationPref(key);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Account Settings
        </h1>
        <p className="text-sm text-slate-400">
          Configure notification preferences and inspect account security modules.
        </p>
      </div>

      {!account && (
        <StageNotice
          title="Local Preferences Preview"
          description="Sign in with Google to save your notification preferences permanently. Without signing in, toggles apply to this browser session only."
          actionLabel="Sign In"
          actionTo="/login"
        />
      )}

      {settingsError && (
        <p role="alert" className="text-sm text-rose-400">
          {settingsError}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7 lg:col-span-7">
          <h2 className="font-display text-lg font-semibold text-white">Notification Preferences</h2>
          <p className="mt-1 text-xs text-slate-400">
            Select which account updates you want to receive.
          </p>

          <div className="mt-5 divide-y divide-slate-800/80">
            <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-slate-100">Security &amp; Session Alerts</p>
                <p className="text-xs text-slate-400">
                  Notifications for sign-in events, role changes, and wallet signature bindings.
                </p>
              </div>
              <input
                type="checkbox"
                checked={activePrefs.securityAlerts}
                onChange={() => handleToggle('securityAlerts')}
                className="h-4 w-4 rounded border-slate-700 bg-[#050b19] text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-slate-100">KYC Verification Updates</p>
                <p className="text-xs text-slate-400">
                  Status notices when authorized provider or DigiLocker reviews are completed.
                </p>
              </div>
              <input
                type="checkbox"
                checked={activePrefs.kycUpdates}
                onChange={() => handleToggle('kycUpdates')}
                className="h-4 w-4 rounded border-slate-700 bg-[#050b19] text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-slate-100">Platform Release Announcements</p>
                <p className="text-xs text-slate-400">
                  Notices covering upcoming CAREX development stages and published protocol specs.
                </p>
              </div>
              <input
                type="checkbox"
                checked={activePrefs.platformNotices}
                onChange={() => handleToggle('platformNotices')}
                className="h-4 w-4 rounded border-slate-700 bg-[#050b19] text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7 lg:col-span-5">
          <h2 className="font-display text-lg font-semibold text-white">Security &amp; Sessions</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
              <span className="text-sm text-slate-400">Authentication</span>
              <StatusIndicator status={account ? 'Active' : 'Pending'} />
            </div>
            <KeyValueRow
              label="Sign-In Method"
              value={account ? 'Google Sign-In' : 'Preview Session'}
            />
            <KeyValueRow label="Human Verification" value="Separate Security Module" />
            <KeyValueRow label="Wallet Key Custody" value="Non-Custodial (Zero Keys Stored)" />
          </div>
        </section>
      </div>
    </div>
  );
}
