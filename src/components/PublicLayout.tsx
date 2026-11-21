import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { PUBLIC_PRIMARY_NAV_PATHS, ROUTES } from '../utils/routing';
import { AppLink } from './AppLink';
import { CarexLogo } from './CarexLogo';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { currentPath } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNavLinks = PUBLIC_PRIMARY_NAV_PATHS.map(
    (path) => ROUTES.find((r) => r.path === path)!
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#040814] text-slate-100">
      {/* Strict 3-Zone Top Bar Contract: [Brand] — [5 single-line nav links] — [1 primary action] */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#040814]/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <AppLink
            to="/"
            aria-label="CAREX Home"
            onClick={() => setMobileMenuOpen(false)}
            className="whitespace-nowrap shrink-0"
          >
            <CarexLogo size="md" />
          </AppLink>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
            {primaryNavLinks.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <AppLink
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-sky-400'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.shortLabel}
                </AppLink>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action on desktop + mobile toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <AppLink
              to="/login"
              className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 whitespace-nowrap shrink-0 lg:inline-flex"
            >
              Sign In
            </AppLink>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-public-nav"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-800 text-slate-200 transition-colors hover:border-slate-700 hover:text-white lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-public-nav"
            aria-label="Mobile navigation"
            className="border-t border-slate-800/80 bg-[#060d1e] px-4 py-5 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              <AppLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  currentPath === '/' ? 'bg-slate-800/70 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Home
              </AppLink>
              {primaryNavLinks.map((item) => (
                <AppLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    currentPath === item.path
                      ? 'bg-slate-800/70 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </AppLink>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-4">
              <AppLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 whitespace-nowrap"
              >
                Sign In
              </AppLink>
              <AppLink
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-600 hover:text-white whitespace-nowrap"
              >
                Register
              </AppLink>
            </div>
            <div className="mt-4 flex flex-col gap-1 border-t border-slate-800/80 pt-4">
              <span className="px-3 text-xs font-medium text-slate-500">Stage 1 Portal Layouts</span>
              <AppLink
                to="/client"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-sky-300 hover:bg-slate-800/50"
              >
                Client Portal Preview
              </AppLink>
              <AppLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50"
              >
                Admin Console Preview
              </AppLink>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-slate-800/80 bg-[#050a18]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <CarexLogo size="md" />
              <p className="text-xs font-medium tracking-[0.14em] text-sky-400">
                POWERING THE NEXT GENERATION
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-slate-400">
                CAREX (CRX) Web Platform — Stage 1 corporate website, architecture overview, and
                modular portal layouts.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Platform</p>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <AppLink to="/" className="transition-colors hover:text-white">
                    Home
                  </AppLink>
                </li>
                <li>
                  <AppLink to="/about" className="transition-colors hover:text-white">
                    About CAREX
                  </AppLink>
                </li>
                <li>
                  <AppLink to="/ecosystem" className="transition-colors hover:text-white">
                    Ecosystem
                  </AppLink>
                </li>
                <li>
                  <AppLink to="/token" className="transition-colors hover:text-white">
                    CRX Token
                  </AppLink>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Resources</p>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <AppLink to="/roadmap" className="transition-colors hover:text-white">
                    Roadmap
                  </AppLink>
                </li>
                <li>
                  <AppLink to="/documentation" className="transition-colors hover:text-white">
                    Documentation
                  </AppLink>
                </li>
                <li>
                  <AppLink to="/login" className="transition-colors hover:text-white">
                    Login
                  </AppLink>
                </li>
                <li>
                  <AppLink to="/register" className="transition-colors hover:text-white">
                    Registration
                  </AppLink>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Portal Layouts (Stage 1)</p>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <AppLink to="/client" className="transition-colors hover:text-white">
                    Client Dashboard
                  </AppLink>
                </li>
                <li>
                  <AppLink to="/client/kyc" className="transition-colors hover:text-white">
                    Client KYC Verification
                  </AppLink>
                </li>
                <li>
                  <AppLink to="/admin" className="transition-colors hover:text-white">
                    Admin Dashboard
                  </AppLink>
                </li>
                <li>
                  <AppLink to="/admin/logs" className="transition-colors hover:text-white">
                    Admin Activity Logs
                  </AppLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} CAREX (CRX). Stage 1 Web Platform Architecture.</p>
            <p>
              Blockchain protocol, tokenomics, and business specifications are governed separately.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
