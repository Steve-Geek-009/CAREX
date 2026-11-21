import React from 'react';
import { AppLink } from '../../components/AppLink';
import { PortalShell } from '../../components/PortalShell';
import { useAuth } from '../../context/AuthContext';
import { usePreviewState } from '../../context/PreviewRoleContext';
import { useRouter } from '../../context/RouterContext';
import { getRoutesByPortal } from '../../utils/routing';

export function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const { account, signOutUser, authBusy } = useAuth();
  const { clientProfile } = usePreviewState();
  const { navigate } = useRouter();
  const clientRoutes = getRoutesByPortal('client');

  const displayName = account?.displayName ?? clientProfile.displayName;
  const accountId = account ? `CRX-${String(account.id).padStart(6, '0')}` : clientProfile.accountId;

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/login');
  };

  return (
    <PortalShell
      portalTitle="Client Portal"
      portalSubtitle={account ? 'Authenticated Session' : 'Stage 1 Layout Preview'}
      navRoutes={clientRoutes}
      headerAction={
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden text-slate-400 sm:inline">{displayName}</span>
          {account ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={authBusy}
              className="rounded-lg border border-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white whitespace-nowrap"
            >
              Sign Out
            </button>
          ) : (
            <AppLink
              to="/login"
              className="rounded-lg border border-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white whitespace-nowrap"
            >
              Sign In
            </AppLink>
          )}
        </div>
      }
      sidebarFooter={
        <div className="rounded-lg border border-slate-800/80 bg-[#081124] p-3 text-xs">
          <p className="font-medium text-slate-200">
            {account ? 'Account ID' : 'Account ID (Placeholder)'}
          </p>
          <p className="mt-1 font-mono text-[11px] tabular-nums text-slate-400">{accountId}</p>
          <div className="mt-3 border-t border-slate-800/80 pt-2.5">
            <AppLink to="/admin" className="font-medium text-sky-400 hover:text-sky-300">
              Switch to Admin Console
            </AppLink>
          </div>
        </div>
      }
    >
      {children}
    </PortalShell>
  );
}
