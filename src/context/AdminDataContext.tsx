import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  useAuth,
  type AdminOverviewData,
  type AuthenticatedAccount,
  type PersistedActivityLog,
} from './AuthContext';
import type { AccountStatus } from '../utils/rbac';

interface AdminDataContextValue {
  overview: AdminOverviewData | null;
  users: AuthenticatedAccount[];
  activityLogs: PersistedActivityLog[];
  loading: boolean;
  error: string | null;
  mutatingUid: string | null;
  refreshOverview: () => Promise<void>;
  changeUserStatus: (targetUid: string, nextStatus: AccountStatus) => Promise<boolean>;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const { account, fetchAdminOverview, updateAdminUserStatus } = useAuth();
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutatingUid, setMutatingUid] = useState<string | null>(null);

  const isAuthorizedAdmin =
    account?.role === 'ADMIN' && account?.accountStatus === 'ACTIVE';

  const refreshOverview = useCallback(async () => {
    if (!isAuthorizedAdmin) {
      setOverview(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminOverview();
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load administrative records.');
    } finally {
      setLoading(false);
    }
  }, [isAuthorizedAdmin, fetchAdminOverview]);

  useEffect(() => {
    void refreshOverview();
  }, [refreshOverview]);

  const changeUserStatus = useCallback(
    async (targetUid: string, nextStatus: AccountStatus) => {
      setMutatingUid(targetUid);
      setError(null);
      try {
        await updateAdminUserStatus(targetUid, nextStatus);
        await refreshOverview();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to update account status.');
        return false;
      } finally {
        setMutatingUid(null);
      }
    },
    [updateAdminUserStatus, refreshOverview]
  );

  const value = useMemo<AdminDataContextValue>(
    () => ({
      overview,
      users: overview?.users ?? [],
      activityLogs: overview?.activityLogs ?? [],
      loading,
      error,
      mutatingUid,
      refreshOverview,
      changeUserStatus,
    }),
    [overview, loading, error, mutatingUid, refreshOverview, changeUserStatus]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error('useAdminData must be used inside AdminDataProvider');
  }
  return ctx;
}
