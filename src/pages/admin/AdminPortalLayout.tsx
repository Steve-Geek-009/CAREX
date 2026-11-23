import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { CarexLogo } from '../../components/CarexLogo';
import { PortalShell } from '../../components/PortalShell';
import { AdminDataProvider } from '../../context/AdminDataContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { canAccessPortal, getRoleLabel } from '../../utils/rbac';
import { getRoutesByPortal } from '../../utils/routing';

export function AdminPortalLayout({ children }: { children: React.ReactNode }) {
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
  const adminRoutes = getRoutesByPortal('admin');

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
            Verifying administrative privileges...
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
            Administrative Access Denied
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{restrictedReason}</p>
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
              Administrator Authentication Required
            </span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">
            Sign In to Access the Admin Console
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            The CAREX Administrator Console requires a verified Google account assigned the server-side{' '}
            <strong className="text-white">ADMIN</strong> role.
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
              to="/"
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white whitespace-nowrap"
            >
              Public Website
            </AppLink>
          </div>
        </div>
      </div>
    );
  }

  const hasAdminAccess = canAccessPortal(account.role, 'admin', account.accountStatus);

  if (!hasAdminAccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#040814] px-4 py-16 text-slate-100">
        <div className="w-full max-w-lg rounded-xl border border-slate-800/90 bg-[#081124] p-8 text-left">
          <div className="flex items-center gap-3 text-rose-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              Role-Based Access Control Enforced
            </span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">
            Administrative Access Restricted
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Your verified account (<strong className="text-white">{account.email}</strong>) holds
            the <strong className="text-white">{getRoleLabel(account.role)}</strong> role and is not
            authorized to access the CAREX Administrator Console.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Administrative access is verified server-side on every request using Firebase ID tokens
            and PostgreSQL role records. Client accounts cannot self-assign administrator
            privileges.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-6">
            <AppLink
              to="/client"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
            >
              Return to Client Portal
            </AppLink>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={authBusy}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60 whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <PortalShell
        portalTitle="Administrator Console"
        portalSubtitle="RBAC Protected · Verified ADMIN"
        navRoutes={adminRoutes}
        headerAction={
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden max-w-[180px] truncate text-slate-300 sm:inline">
              {account.displayName}
            </span>
            <AppLink
              to="/client"
              className="rounded-lg border border-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white whitespace-nowrap"
            >
              Client Portal
            </AppLink>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={authBusy}
              className="rounded-lg border border-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white disabled:opacity-60 whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>
        }
        sidebarFooter={
          <div className="rounded-lg border border-slate-800/80 bg-[#081124] p-3 text-xs space-y-1.5">
            <p className="font-medium text-slate-200">Verified Administrator</p>
            <p className="truncate font-mono text-[11px] text-sky-300">{account.email}</p>
            <p className="text-[11px] text-slate-500">Server-verified ADMIN session</p>
          </div>
        }
      >
        {children}
      </PortalShell>
    </AdminDataProvider>
  );
}
