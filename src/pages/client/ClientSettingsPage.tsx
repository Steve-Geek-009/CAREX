import React, { useState } from 'react';
import { StatusIndicator } from '../../components/StatusIndicator';
import { KeyValueRow } from '../../components/UiPrimitives';
import { useAuth } from '../../context/AuthContext';
import { getAccountStatusLabel } from '../../utils/rbac';

function formatUtcTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

export function ClientSettingsPage() {
  const { account, saveSettingsToServer } = useAuth();
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  if (!account) return null;

  const isReadOnly = account.accountStatus !== 'ACTIVE';

  const activePrefs = {
    securityAlerts: account.notifySecurity,
    kycUpdates: account.notifyKyc,
    platformNotices: account.notifyPlatform,
  };

  const handleToggle = async (key: 'securityAlerts' | 'kycUpdates' | 'platformNotices') => {
    if (isReadOnly) {
      setSettingsError('Notification preferences cannot be changed while your account is under review.');
      return;
    }

    setSettingsError(null);
    setSavingKey(key);
    const next = { ...activePrefs, [key]: !activePrefs[key] };
    try {
      await saveSettingsToServer({
        notifySecurity: next.securityAlerts,
        notifyKyc: next.kycUpdates,
        notifyPlatform: next.platformNotices,
      });
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Unable to save settings.');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Account Settings
        </h1>
        <p className="text-sm text-slate-400">
          Configure notification preferences and inspect your verified authentication security.
        </p>
      </div>

      {settingsError && (
        <p role="alert" className="text-sm text-rose-400">
          {settingsError}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7 lg:col-span-7">
          <h2 className="font-display text-lg font-semibold text-white">Notification Preferences</h2>
          <p className="mt-1 text-xs text-slate-400">
            Select which account updates you want to receive. Changes persist directly to your
            CAREX account.
          </p>

          <div className="mt-5 divide-y divide-slate-800/80">
            <label
              className={`flex items-center justify-between gap-4 py-4 ${
                isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-slate-100">Security &amp; Session Alerts</p>
                <p className="text-xs text-slate-400">
                  Notifications for sign-in events, role changes, and wallet signature bindings.
                </p>
              </div>
              <input
                type="checkbox"
                checked={activePrefs.securityAlerts}
                disabled={isReadOnly || savingKey === 'securityAlerts'}
                onChange={() => void handleToggle('securityAlerts')}
                className="h-4 w-4 rounded border-slate-700 bg-[#050b19] text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
            </label>

            <label
              className={`flex items-center justify-between gap-4 py-4 ${
                isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-slate-100">KYC Verification Updates</p>
                <p className="text-xs text-slate-400">
                  Status notices when authorized provider or DigiLocker reviews are completed.
                </p>
              </div>
              <input
                type="checkbox"
                checked={activePrefs.kycUpdates}
                disabled={isReadOnly || savingKey === 'kycUpdates'}
                onChange={() => void handleToggle('kycUpdates')}
                className="h-4 w-4 rounded border-slate-700 bg-[#050b19] text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
            </label>

            <label
              className={`flex items-center justify-between gap-4 py-4 ${
                isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-slate-100">Platform Release Announcements</p>
                <p className="text-xs text-slate-400">
                  Notices covering upcoming CAREX development stages and published protocol specs.
                </p>
              </div>
              <input
                type="checkbox"
                checked={activePrefs.platformNotices}
                disabled={isReadOnly || savingKey === 'platformNotices'}
                onChange={() => void handleToggle('platformNotices')}
                className="h-4 w-4 rounded border-slate-700 bg-[#050b19] text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7 lg:col-span-5">
          <h2 className="font-display text-lg font-semibold text-white">Security &amp; Sessions</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between border-b border-slate-800/70 py-3.5">
              <span className="text-sm text-slate-400">Account Status</span>
              <StatusIndicator status={getAccountStatusLabel(account.accountStatus)} />
            </div>
            <KeyValueRow label="Sign-In Provider" value="Google Sign-In (Firebase Auth)" />
            <KeyValueRow label="Last Sign-In" value={formatUtcTimestamp(account.lastLoginAt)} mono />
            <KeyValueRow label="Human Verification" value="Separate Security Module" />
            <KeyValueRow label="Wallet Key Custody" value="Non-Custodial (Zero Keys Stored)" />
          </div>
        </section>
      </div>
    </div>
  );
}
