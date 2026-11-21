import React, { createContext, useContext, useMemo, useState } from 'react';
import type { UserRole } from '../utils/rbac';
import {
  INITIAL_ADMIN_KYC,
  INITIAL_ADMIN_USERS,
  INITIAL_CLIENT_PROFILE,
  type AdminKycPlaceholder,
  type AdminUserPlaceholder,
  type ClientProfilePlaceholder,
} from '../data/stage1Placeholders';

interface ClientNotificationPrefs {
  securityAlerts: boolean;
  kycUpdates: boolean;
  platformNotices: boolean;
}

interface PreviewStateContextValue {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  clientProfile: ClientProfilePlaceholder;
  updateClientProfile: (patch: Partial<ClientProfilePlaceholder>) => void;
  notificationPrefs: ClientNotificationPrefs;
  toggleNotificationPref: (key: keyof ClientNotificationPrefs) => void;
  adminUsers: AdminUserPlaceholder[];
  updateAdminUserStatus: (userId: string, status: AdminUserPlaceholder['accountStatus']) => void;
  adminKycQueue: AdminKycPlaceholder[];
  updateAdminKycStatus: (applicationId: string, status: AdminKycPlaceholder['status']) => void;
}

const PreviewStateContext = createContext<PreviewStateContextValue | null>(null);

export function PreviewStateProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [clientProfile, setClientProfile] =
    useState<ClientProfilePlaceholder>(INITIAL_CLIENT_PROFILE);
  const [notificationPrefs, setNotificationPrefs] = useState<ClientNotificationPrefs>({
    securityAlerts: true,
    kycUpdates: true,
    platformNotices: false,
  });
  const [adminUsers, setAdminUsers] = useState<AdminUserPlaceholder[]>([...INITIAL_ADMIN_USERS]);
  const [adminKycQueue, setAdminKycQueue] = useState<AdminKycPlaceholder[]>([
    ...INITIAL_ADMIN_KYC,
  ]);

  const value = useMemo<PreviewStateContextValue>(
    () => ({
      activeRole,
      setActiveRole,
      clientProfile,
      updateClientProfile: (patch) =>
        setClientProfile((prev) => ({ ...prev, ...patch })),
      notificationPrefs,
      toggleNotificationPref: (key) =>
        setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] })),
      adminUsers,
      updateAdminUserStatus: (userId, status) =>
        setAdminUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, accountStatus: status } : u))
        ),
      adminKycQueue,
      updateAdminKycStatus: (applicationId, status) =>
        setAdminKycQueue((prev) =>
          prev.map((item) =>
            item.applicationId === applicationId ? { ...item, status } : item
          )
        ),
    }),
    [activeRole, clientProfile, notificationPrefs, adminUsers, adminKycQueue]
  );

  return (
    <PreviewStateContext.Provider value={value}>
      {children}
    </PreviewStateContext.Provider>
  );
}

export function usePreviewState(): PreviewStateContextValue {
  const ctx = useContext(PreviewStateContext);
  if (!ctx) {
    throw new Error('usePreviewState must be used inside PreviewStateProvider');
  }
  return ctx;
}
