import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { CarexLogo } from '../../components/CarexLogo';
import { PortalShell } from '../../components/PortalShell';
import { StageNotice } from '../../components/UiPrimitives';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { getRoutesByPortal } from '../../utils/routing';

export function ClientPortalLayout({ children }: { children: React.ReactNode }) {
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
  const clientRoutes = getRoutesByPortal('client');

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/login');
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#040814] px-4 py-16 text-slate-100">
        <div className="w-full max-w-md rounded-xl border border-slate-800/90 bg-[#081124] p-8 space-y-4">
          <CarexLogo size="sm" />
          <p className="text-sm font-medium text-slate-200" role="status">
            Verifying CAREX authentication session...
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (restrictedReason) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#040814] px-4 py-16 text-slate-100">
        <div className="w-full max-w-lg rounded-xl border border-slate-800/90 bg-[#081124] p-8 text-left">
          <div className="flex items-center gap-3 text-rose-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              Account Restricted
            </span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">
            Client Portal Access Denied
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{restrictedReason}</p>
          <p className="mt-3 text-xs text-slate-400">
            Account restrictions are enforced server-side on all CAREX APIs. Sign out below or
            contact CAREX compliance support for review.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-6">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={authBusy}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60 whitespace-nowrap"
            >
              {authBusy ? 'Signing out...' : 'Sign Out'}
            </button>
            <AppLink
              to="/"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white whitespace-nowrap"
            >
              Return to Public Website
            </AppLink>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#040814] px-4 py-16 text-slate-100">
        <div className="w-full max-w-lg rounded-xl border border-slate-800/90 bg-[#081124] p-8 text-left">
          <div className="flex items-center gap-3 text-sky-400">
            <Lock className="h-5 w-5 shrink-0" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              Authentication Required
            </span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">
            Sign In to Access the Client Portal
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            The CAREX Client Portal requires a verified Google account session backed by server-side
            token verification.
          </p>
          {authError && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-300"
            >
              {authError}
            </div>
          )}
          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-6">
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              disabled={authBusy}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60 whitespace-nowrap"
            >
              {authBusy ? 'Authenticating...' : 'Continue with Google'}
            </button>
            <AppLink
              to="/login"
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white whitespace-nowrap"
            >
              Go to Sign In Page
            </AppLink>
            <AppLink
              to="/"
              className="text-sm font-medium text-slate-400 hover:text-white whitespace-nowrap"
            >
              Public Website
            </AppLink>
          </div>
        </div>
      </div>
    );
  }

  const accountId = `CRX-${String(account.id).padStart(6, '0')}`;
  const isAdmin = account.role === 'ADMIN' && account.accountStatus === 'ACTIVE';
  const isUnderReview = account.accountStatus === 'UNDER_REVIEW';

  return (
    <PortalShell
      portalTitle="Client Portal"
      portalSubtitle={isUnderReview ? 'Read-Only · Under Review' : 'Authenticated Session'}
      navRoutes={clientRoutes}
      headerAction={
        <div className="flex items-center gap-3 text-xs">
          {account.photoUrl ? (
            <img
              src={account.photoUrl}
              alt={`${account.displayName} avatar`}
              referrerPolicy="no-referrer"
              className="hidden h-7 w-7 rounded-full border border-slate-700 object-cover sm:block"
            />
          ) : (
            <span className="hidden h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-[#081124] font-display text-xs font-semibold text-sky-300 sm:inline-flex">
              {account.displayName.slice(0, 1).toUpperCase()}
            </span>
          )}
          <span className="hidden max-w-[180px] truncate text-slate-300 sm:inline">
            {account.displayName}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={authBusy}
            className="rounded-lg border border-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60 whitespace-nowrap"
          >
            {authBusy ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      }
      sidebarFooter={
        <div className="rounded-lg border border-slate-800/80 bg-[#081124] p-3 text-xs">
          <p className="font-medium text-slate-200">Account ID</p>
          <p className="mt-1 font-mono text-[11px] tabular-nums text-slate-400">{accountId}</p>
          {isAdmin && (
            <div className="mt-3 border-t border-slate-800/80 pt-2.5">
              <AppLink to="/admin" className="font-medium text-sky-400 hover:text-sky-300">
                Open Admin Console
              </AppLink>
            </div>
          )}
        </div>
      }
    >
      {isUnderReview && (
        <div className="mb-6">
          <StageNotice
            title="Account Under Review — Read-Only Access Active"
            description="Your CAREX account is currently under compliance review. You may view your dashboard, profile, and activity records, but profile and notification changes are temporarily disabled."
          />
        </div>
      )}
      {children}
    </PortalShell>
  );
}
