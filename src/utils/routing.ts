export type PortalArea = 'public' | 'client' | 'admin';

export interface RouteDefinition {
  path: string;
  label: string;
  shortLabel: string;
  portal: PortalArea;
  title: string;
  breadcrumbs: string[];
}

export const ROUTES: readonly RouteDefinition[] = [
  // A. PUBLIC WEBSITE (8 pages)
  {
    path: '/',
    label: 'Home',
    shortLabel: 'Home',
    portal: 'public',
    title: 'CAREX (CRX) — Powering the Next Generation',
    breadcrumbs: ['CAREX', 'Home'],
  },
  {
    path: '/about',
    label: 'About CAREX',
    shortLabel: 'About',
    portal: 'public',
    title: 'About CAREX — Institutional Web3 Platform',
    breadcrumbs: ['CAREX', 'About'],
  },
  {
    path: '/ecosystem',
    label: 'Ecosystem',
    shortLabel: 'Ecosystem',
    portal: 'public',
    title: 'Ecosystem — CAREX Web Platform',
    breadcrumbs: ['CAREX', 'Ecosystem'],
  },
  {
    path: '/token',
    label: 'CRX Token',
    shortLabel: 'CRX Token',
    portal: 'public',
    title: 'CRX Token — CAREX',
    breadcrumbs: ['CAREX', 'CRX Token'],
  },
  {
    path: '/roadmap',
    label: 'Roadmap',
    shortLabel: 'Roadmap',
    portal: 'public',
    title: 'Roadmap — CAREX Development Stages',
    breadcrumbs: ['CAREX', 'Roadmap'],
  },
  {
    path: '/documentation',
    label: 'Documentation',
    shortLabel: 'Docs',
    portal: 'public',
    title: 'Documentation — CAREX Architecture',
    breadcrumbs: ['CAREX', 'Documentation'],
  },
  {
    path: '/login',
    label: 'Login',
    shortLabel: 'Sign In',
    portal: 'public',
    title: 'Sign In — CAREX Platform',
    breadcrumbs: ['CAREX', 'Sign In'],
  },
  {
    path: '/register',
    label: 'Registration',
    shortLabel: 'Register',
    portal: 'public',
    title: 'Create Account — CAREX Platform',
    breadcrumbs: ['CAREX', 'Registration'],
  },

  // B. CLIENT PORTAL (6 pages)
  {
    path: '/client',
    label: 'Client Dashboard',
    shortLabel: 'Dashboard',
    portal: 'client',
    title: 'Client Dashboard — CAREX Portal',
    breadcrumbs: ['Client Portal', 'Dashboard'],
  },
  {
    path: '/client/profile',
    label: 'User Profile',
    shortLabel: 'Profile',
    portal: 'client',
    title: 'User Profile — CAREX Client Portal',
    breadcrumbs: ['Client Portal', 'User Profile'],
  },
  {
    path: '/client/kyc',
    label: 'KYC Verification',
    shortLabel: 'KYC Verification',
    portal: 'client',
    title: 'KYC Verification — CAREX Client Portal',
    breadcrumbs: ['Client Portal', 'KYC Verification'],
  },
  {
    path: '/client/wallet',
    label: 'Wallet Management',
    shortLabel: 'Wallet',
    portal: 'client',
    title: 'Wallet Management — CAREX Client Portal',
    breadcrumbs: ['Client Portal', 'Wallet Management'],
  },
  {
    path: '/client/settings',
    label: 'Account Settings',
    shortLabel: 'Settings',
    portal: 'client',
    title: 'Account Settings — CAREX Client Portal',
    breadcrumbs: ['Client Portal', 'Account Settings'],
  },
  {
    path: '/client/transactions',
    label: 'Transaction History',
    shortLabel: 'Transactions',
    portal: 'client',
    title: 'Transaction History — CAREX Client Portal',
    breadcrumbs: ['Client Portal', 'Transaction History'],
  },

  // C. ADMIN PORTAL (6 pages)
  {
    path: '/admin',
    label: 'Admin Dashboard',
    shortLabel: 'Dashboard',
    portal: 'admin',
    title: 'Admin Dashboard — CAREX Console',
    breadcrumbs: ['Admin Console', 'Dashboard'],
  },
  {
    path: '/admin/users',
    label: 'User Management',
    shortLabel: 'Users',
    portal: 'admin',
    title: 'User Management — CAREX Admin Console',
    breadcrumbs: ['Admin Console', 'User Management'],
  },
  {
    path: '/admin/kyc',
    label: 'KYC Management',
    shortLabel: 'KYC Queue',
    portal: 'admin',
    title: 'KYC Management — CAREX Admin Console',
    breadcrumbs: ['Admin Console', 'KYC Management'],
  },
  {
    path: '/admin/wallets',
    label: 'Wallet Management',
    shortLabel: 'Wallets',
    portal: 'admin',
    title: 'Wallet Management — CAREX Admin Console',
    breadcrumbs: ['Admin Console', 'Wallet Management'],
  },
  {
    path: '/admin/accounts',
    label: 'Account Management',
    shortLabel: 'Accounts',
    portal: 'admin',
    title: 'Account Management — CAREX Admin Console',
    breadcrumbs: ['Admin Console', 'Account Management'],
  },
  {
    path: '/admin/logs',
    label: 'Activity Logs',
    shortLabel: 'Activity Logs',
    portal: 'admin',
    title: 'Activity Logs — CAREX Admin Console',
    breadcrumbs: ['Admin Console', 'Activity Logs'],
  },
] as const;

const ROUTE_ALIASES: Record<string, string> = {
  '/home': '/',
  '/about-carex': '/about',
  '/crx-token': '/token',
  '/docs': '/documentation',
  '/client/dashboard': '/client',
  '/admin/dashboard': '/admin',
};

export function normalizePath(rawPath: string): string {
  const withoutQuery = rawPath.split('?')[0].split('#')[0];
  const trimmed = withoutQuery.length > 1 ? withoutQuery.replace(/\/+$/, '') : withoutQuery || '/';
  const lower = trimmed.toLowerCase();
  return ROUTE_ALIASES[lower] ?? lower;
}

export function resolveRoute(rawPath: string): RouteDefinition {
  const normalized = normalizePath(rawPath);
  const found = ROUTES.find((r) => r.path === normalized);
  if (found) {
    return found;
  }
  return ROUTES[0];
}

export function isKnownRoute(rawPath: string): boolean {
  const normalized = normalizePath(rawPath);
  return ROUTES.some((r) => r.path === normalized);
}

export function getRoutesByPortal(portal: PortalArea): RouteDefinition[] {
  return ROUTES.filter((r) => r.portal === portal);
}

export const PUBLIC_PRIMARY_NAV_PATHS = [
  '/about',
  '/ecosystem',
  '/token',
  '/roadmap',
  '/documentation',
] as const;
