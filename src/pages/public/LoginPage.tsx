import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { CarexLogo } from '../../components/CarexLogo';
import { StatusIndicator } from '../../components/StatusIndicator';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { getAccountStatusLabel, getRoleLabel } from '../../utils/rbac';

export function LoginPage() {
  const {
    account,
    authReady,
    authBusy,
    authError,
    restrictedReason,
    signInWithGoogle,
    signOutUser,
  } = useAuth();
  const { navigate } = useRouter();

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.ok) {
      navigate('/client');
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left Architectural Context */}
        <div className="flex flex-col justify-between space-y-8 lg:col-span-5">
          <div className="space-y-4">
            <CarexLogo size="md" />
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Sign In to CAREX
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Authenticate with your verified Google account to access your CAREX Client Portal,
              manage your profile and preferences, and monitor your account activity.
            </p>
          </div>

          <div className="space-y-4 border-t border-slate-800/80 pt-6">
            <p className="text-xs font-medium text-sky-400">Authentication Security</p>
            <p className="text-sm leading-relaxed text-slate-400">
              CAREX Draft 1 uses Google Sign-In exclusively through Firebase Authentication with
              server-side token verification. First-time sign-in automatically creates your CAREX
              client record.
            </p>
            <p className="text-xs text-slate-500">
              CAREX never stores Google passwords and never requests wallet private keys or seed
              phrases.
            </p>
          </div>
        </div>

        {/* Right Google Authentication Panel */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-7 sm:p-9">
            {!authReady ? (
              <div className="space-y-4 py-6" role="status" aria-live="polite">
                <p className="text-sm font-medium text-slate-200">
                  Verifying authentication session...
                </p>
                <div className="h-11 w-full animate-pulse rounded-lg bg-slate-800/70" />
              </div>
            ) : restrictedReason ? (
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 text-rose-400">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-semibold tracking-wider uppercase">
                    Account Restricted
                  </span>
                </div>
                <h2 className="font-display text-xl font-semibold text-white">
                  Portal Access Denied
                </h2>
                <p className="text-sm leading-relaxed text-slate-300">{restrictedReason}</p>
                <div className="flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-5">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={authBusy}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60"
                  >
                    {authBusy ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            ) : account ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 text-cyan-300">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-semibold tracking-wider uppercase">
                    Authenticated Session Active
                  </span>
                </div>

                <div className="flex items-center gap-4 border-y border-slate-800/80 py-5">
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-white">
                      {account.displayName}
                    </p>
                    <p className="truncate text-sm text-slate-400">{account.email}</p>
                  </div>
                  <StatusIndicator status={getAccountStatusLabel(account.accountStatus)} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span>Role: {getRoleLabel(account.role)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    ID: CRX-{String(account.id).padStart(6, '0')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <AppLink
                    to="/client"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
                  >
                    Open Client Portal
                  </AppLink>
                  {account.role === 'ADMIN' && account.accountStatus === 'ACTIVE' && (
                    <AppLink
                      to="/admin"
                      className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:border-cyan-300/60 hover:text-white whitespace-nowrap"
                    >
                      Open Admin Console
                    </AppLink>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={authBusy}
                    className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60 whitespace-nowrap"
                  >
                    {authBusy ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-xl font-semibold text-white">
                    Google Account Sign-In
                  </h2>
                  <p className="text-sm text-slate-400">
                    Use your Google account to sign in or automatically register a new CAREX
                    account.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={authBusy}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#FFFFFF"
                        d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.6-5.4 3.6-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.1 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z"
                      />
                    </svg>
                    <span>{authBusy ? 'Authenticating with Google...' : 'Continue with Google'}</span>
                  </button>

                  {authError && (
                    <div
                      role="alert"
                      className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-300"
                    >
                      {authError}
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t border-slate-800/80 pt-5 text-xs text-slate-400">
                  <p className="font-medium text-slate-300">What happens next</p>
                  <p className="leading-relaxed">
                    Your Google identity token is verified server-side by CAREX. New accounts are
                    provisioned with the standard Client role, while returning users resume their
                    saved profile and activity history.
                  </p>
                </div>

                <p className="border-t border-slate-800/80 pt-5 text-sm text-slate-400">
                  First time using CAREX?{' '}
                  <AppLink to="/register" className="font-medium text-sky-300 hover:text-white">
                    Review onboarding &amp; create account
                  </AppLink>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
