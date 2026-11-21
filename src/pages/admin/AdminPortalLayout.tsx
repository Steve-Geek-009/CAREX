import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { PortalShell } from '../../components/PortalShell';
import { usePreviewState } from '../../context/PreviewRoleContext';
import { canAccessPortal, getRoleLabel } from '../../utils/rbac';
import { getRoutesByPortal } from '../../utils/routing';

export function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { activeRole, setActiveRole } = usePreviewState();
  const adminRoutes = getRoutesByPortal('admin');
  const hasAdminAccess = canAccessPortal(activeRole, 'admin');

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
            Your current preview role (<strong className="text-white">{getRoleLabel(activeRole)}</strong>)
            is not authorized to access the CAREX Administrator Console. Ordinary client users are
            strictly prohibited from viewing or executing administrative functionality.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            In production, this protection will be enforced server-side via Firebase Authentication
            Custom Claims and Cloud Firestore Security Rules.
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
              onClick={() => setActiveRole('admin')}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white whitespace-nowrap"
            >
              Restore Administrator Preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PortalShell
      portalTitle="Administrator Console"
      portalSubtitle="RBAC Protected · Stage 1 Preview"
      navRoutes={adminRoutes}
      headerAction={
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden text-slate-400 sm:inline">{getRoleLabel(activeRole)}</span>
          <AppLink
            to="/client"
            className="rounded-lg border border-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white whitespace-nowrap"
          >
            Client Portal
          </AppLink>
        </div>
      }
      sidebarFooter={
        <div className="rounded-lg border border-slate-800/80 bg-[#081124] p-3 text-xs space-y-2.5">
          <div>
            <p className="font-medium text-slate-200">RBAC Preview Control</p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Active role: <span className="text-sky-300">{getRoleLabel(activeRole)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveRole('client')}
            className="w-full rounded-md border border-slate-700/90 px-3 py-1.5 text-left text-[11px] font-medium text-slate-200 transition-colors hover:border-rose-500/60 hover:text-white"
          >
            Test Standard User Block
          </button>
        </div>
      }
    >
      {children}
    </PortalShell>
  );
}
