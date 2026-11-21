import React, { useState } from 'react';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import type { RouteDefinition } from '../utils/routing';
import { AppLink } from './AppLink';
import { CarexLogo } from './CarexLogo';

interface PortalShellProps {
  portalTitle: string;
  portalSubtitle: string;
  navRoutes: readonly RouteDefinition[];
  headerAction?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
}

export function PortalShell({
  portalTitle,
  portalSubtitle,
  navRoutes,
  headerAction,
  sidebarFooter,
  children,
}: PortalShellProps) {
  const { currentPath, route } = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderNavList = (closeOnSelect: boolean) => (
    <nav aria-label={`${portalTitle} navigation`} className="flex flex-col gap-1">
      {navRoutes.map((item) => {
        const active = currentPath === item.path;
        return (
          <AppLink
            key={item.path}
            to={item.path}
            aria-current={active ? 'page' : undefined}
            onClick={() => {
              if (closeOnSelect) setDrawerOpen(false);
            }}
            className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
              active
                ? 'bg-blue-600/18 text-white ring-1 ring-inset ring-blue-500/40'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
            }`}
          >
            <span>{item.label}</span>
          </AppLink>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#040814] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[264px] shrink-0 flex-col border-r border-slate-800/80 bg-[#060c1b] lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
          <AppLink to="/" aria-label="Return to CAREX Public Site">
            <CarexLogo size="sm" />
          </AppLink>
        </div>

        <div className="border-b border-slate-800/70 px-5 py-4">
          <p className="text-xs font-semibold text-sky-400">{portalTitle}</p>
          <p className="mt-0.5 text-xs text-slate-400">{portalSubtitle}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3.5 py-4">{renderNavList(false)}</div>

        <div className="border-t border-slate-800/80 p-4 space-y-3">
          {sidebarFooter}
          <AppLink
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Public Website</span>
          </AppLink>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Contextual Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-800/80 bg-[#040814]/92 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen((o) => !o)}
              aria-expanded={drawerOpen}
              aria-controls="portal-mobile-drawer"
              aria-label={drawerOpen ? 'Close portal sidebar' : 'Open portal sidebar'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white lg:hidden"
            >
              {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
              <span className="truncate text-slate-400">{route.breadcrumbs[0]}</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span className="truncate font-medium text-white">{route.breadcrumbs[1]}</span>
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0">{headerAction}</div>
        </header>

        {/* Mobile Slide-Over Drawer */}
        {drawerOpen && (
          <div
            id="portal-mobile-drawer"
            className="border-b border-slate-800/90 bg-[#060c1b] px-4 py-4 lg:hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-sky-400">{portalTitle}</p>
                <p className="text-xs text-slate-400">{portalSubtitle}</p>
              </div>
              <AppLink
                to="/"
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-medium text-slate-300 hover:text-white"
              >
                Public Site
              </AppLink>
            </div>
            {renderNavList(true)}
            {sidebarFooter && (
              <div className="mt-4 border-t border-slate-800/80 pt-3">{sidebarFooter}</div>
            )}
          </div>
        )}

        <main className="flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="mx-auto max-w-6xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
