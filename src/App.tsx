import React from 'react';
import { PublicLayout } from './components/PublicLayout';
import { AuthProvider } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AdminAccountsPage } from './pages/admin/AdminAccountsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminKycPage } from './pages/admin/AdminKycPage';
import { AdminLogsPage } from './pages/admin/AdminLogsPage';
import { AdminPortalLayout } from './pages/admin/AdminPortalLayout';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminWalletsPage } from './pages/admin/AdminWalletsPage';
import { ClientDashboardPage } from './pages/client/ClientDashboardPage';
import { ClientKycPage } from './pages/client/ClientKycPage';
import { ClientPortalLayout } from './pages/client/ClientPortalLayout';
import { ClientProfilePage } from './pages/client/ClientProfilePage';
import { ClientSettingsPage } from './pages/client/ClientSettingsPage';
import { ClientTransactionsPage } from './pages/client/ClientTransactionsPage';
import { ClientWalletPage } from './pages/client/ClientWalletPage';
import { AboutPage } from './pages/public/AboutPage';
import { DocumentationPage } from './pages/public/DocumentationPage';
import { EcosystemPage } from './pages/public/EcosystemPage';
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { RoadmapPage } from './pages/public/RoadmapPage';
import { TokenPage } from './pages/public/TokenPage';

class PlatformErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#040814] p-6 text-slate-100">
          <div className="max-w-md rounded-xl border border-slate-800 bg-[#081124] p-7">
            <h1 className="font-display text-xl font-semibold text-white">
              Unexpected Application Error
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              A rendering error occurred in the CAREX interface. Reload to restore the application.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PlatformRouterView() {
  const { currentPath, route } = useRouter();

  if (route.portal === 'client') {
    const renderClientPage = () => {
      switch (currentPath) {
        case '/client/profile':
          return <ClientProfilePage />;
        case '/client/kyc':
          return <ClientKycPage />;
        case '/client/wallet':
          return <ClientWalletPage />;
        case '/client/settings':
          return <ClientSettingsPage />;
        case '/client/transactions':
          return <ClientTransactionsPage />;
        case '/client':
        default:
          return <ClientDashboardPage />;
      }
    };

    return <ClientPortalLayout>{renderClientPage()}</ClientPortalLayout>;
  }

  if (route.portal === 'admin') {
    const renderAdminPage = () => {
      switch (currentPath) {
        case '/admin/users':
          return <AdminUsersPage />;
        case '/admin/kyc':
          return <AdminKycPage />;
        case '/admin/wallets':
          return <AdminWalletsPage />;
        case '/admin/accounts':
          return <AdminAccountsPage />;
        case '/admin/logs':
          return <AdminLogsPage />;
        case '/admin':
        default:
          return <AdminDashboardPage />;
      }
    };

    return <AdminPortalLayout>{renderAdminPage()}</AdminPortalLayout>;
  }

  const renderPublicPage = () => {
    switch (currentPath) {
      case '/about':
        return <AboutPage />;
      case '/ecosystem':
        return <EcosystemPage />;
      case '/token':
        return <TokenPage />;
      case '/roadmap':
        return <RoadmapPage />;
      case '/documentation':
        return <DocumentationPage />;
      case '/login':
        return <LoginPage />;
      case '/register':
        return <RegisterPage />;
      case '/':
      default:
        return <HomePage />;
    }
  };

  return <PublicLayout>{renderPublicPage()}</PublicLayout>;
}

export default function App() {
  return (
    <PlatformErrorBoundary>
      <AuthProvider>
        <RouterProvider>
          <PlatformRouterView />
        </RouterProvider>
      </AuthProvider>
    </PlatformErrorBoundary>
  );
}
