import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { CarexLogo } from '../../components/CarexLogo';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';

export function RegisterPage() {
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

  const handleGoogleRegistration = async () => {
    const result = await signInWithGoogle();
    if (result.ok) {
      navigate('/client');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left Onboarding Sequence Explanation */}
        <div className="space-y-8 lg:col-span-5">
          <div className="space-y-4">
            <CarexLogo size="md" />
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Create Your CAREX Account
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              CAREX separates registration into clear, auditable security layers. First-time Google
              Sign-In automatically creates your verified CAREX Client account in the platform
              database.
            </p>
          </div>

          <ol className="divide-y divide-slate-800/80 border-y border-slate-800/80 text-sm">
            <li className="py-4">
              <p className="font-medium text-white">01. Verified Google Authentication (Active)</p>
              <p className="mt-1 text-xs text-slate-400">
                Real Google Sign-In via Firebase Authentication with server-side ID token
                verification and automatic Client account creation.
              </p>
            </li>
            <li className="py-4">
              <p className="font-medium text-white">02. Independent Human Verification</p>
              <p className="mt-1 text-xs text-slate-400">
                Bot protection and human verification enforced as a separate security requirement in
                a subsequent stage.
              </p>
            </li>
            <li className="py-4">
              <p className="font-medium text-white">03. Authorized KYC Provider Verification</p>
              <p className="mt-1 text-xs text-slate-400">
                Identity verification via an authorized KYC provider; DigiLocker integration is
                scheduled separately after API approval.
              </p>
            </li>
            <li className="py-4">
              <p className="font-medium text-white">04. Non-Custodial Wallet Signature</p>
              <p className="mt-1 text-xs text-slate-400">
                Cryptographic signature ownership check only. Never asks for private keys or seed
                phrases.
              </p>
            </li>
          </ol>
        </div>

        {/* Right Google Registration Panel */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-7 sm:p-9">
            {!authReady ? (
              <div className="space-y-4 py-6" role="status" aria-live="polite">
                <p className="text-sm font-medium text-slate-200">Checking session status...</p>
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
                <p className="text-sm leading-relaxed text-slate-300">{restrictedReason}</p>
                <button
                  type="button"
                  onClick={() => void signOutUser()}
                  disabled={authBusy}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60"
                >
                  {authBusy ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            ) : account ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 text-cyan-300">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-semibold tracking-wider uppercase">
                    Account Already Active
                  </span>
                </div>
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-semibold text-white">
                    Signed in as {account.displayName}
                  </h2>
                  <p className="text-sm text-slate-400">{account.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <AppLink
                    to="/client"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
                  >
                    Go to Client Portal
                  </AppLink>
                  <button
                    type="button"
                    onClick={() => void signOutUser()}
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
                    Register with Google
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-400">
                    Google Sign-In is the exclusive authentication provider for CAREX Draft 1.
                    Signing in for the first time creates your account automatically with standard
                    Client permissions.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleRegistration}
                    disabled={authBusy}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#FFFFFF"
                        d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.6-5.4 3.6-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.1 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z"
                      />
                    </svg>
                    <span>
                      {authBusy ? 'Creating CAREX Account...' : 'Continue with Google'}
                    </span>
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

                <div className="rounded-lg border border-slate-800 bg-[#050b19] px-4 py-3.5 text-xs text-slate-400 space-y-1.5">
                  <p className="font-medium text-slate-200">Account Governance &amp; Privacy</p>
                  <p className="leading-relaxed">
                    New accounts receive the standard Client role by default. CAREX verifies your
                    Google identity token on the backend and stores only your account profile
                    metadata—never Google passwords or authentication credentials.
                  </p>
                </div>

                <p className="border-t border-slate-800/80 pt-5 text-sm text-slate-400">
                  Already have a CAREX account?{' '}
                  <AppLink to="/login" className="font-medium text-sky-300 hover:text-white">
                    Sign in with Google
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
