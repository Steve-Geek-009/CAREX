import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import type { UserRole } from '../utils/rbac';

export interface AuthenticatedAccount {
  id: number;
  uid: string;
  email: string;
  displayName: string;
  jurisdiction: string;
  role: UserRole;
  accountStatus: 'Active' | 'Restricted' | 'Under Review';
  kycStatus: 'Not Submitted' | 'Pending' | 'Verified' | 'Rejected';
  walletStatus: string;
  walletAddress: string | null;
  notifySecurity: boolean;
  notifyKyc: boolean;
  notifyPlatform: boolean;
  createdAt: string;
}

export interface PersistedActivityLog {
  id: number;
  eventCode: string;
  userUid: string | null;
  actorEmail: string;
  category: 'Authentication' | 'KYC' | 'Wallet' | 'Administration';
  summary: string;
  outcome: 'Recorded' | 'Blocked' | 'Pending';
  createdAt: string;
}

interface AuthContextValue {
  firebaseUser: User | null;
  account: AuthenticatedAccount | null;
  userLogs: PersistedActivityLog[];
  authReady: boolean;
  authBusy: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOutUser: () => Promise<void>;
  getToken: () => Promise<string | null>;
  refreshAccount: () => Promise<void>;
  saveProfileToServer: (payload: { displayName: string; jurisdiction: string }) => Promise<boolean>;
  saveSettingsToServer: (payload: {
    notifySecurity: boolean;
    notifyKyc: boolean;
    notifyPlatform: boolean;
  }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [account, setAccount] = useState<AuthenticatedAccount | null>(null);
  const [userLogs, setUserLogs] = useState<PersistedActivityLog[]>([]);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchAccount = useCallback(async (user: User) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || 'Unable to load account details.');
      }
      const data = await response.json();
      setAccount(data.user ?? null);
      setUserLogs(Array.isArray(data.activityLogs) ? data.activityLogs : []);
      setAuthError(null);
    } catch (err) {
      console.error('Failed to sync authenticated profile:', err);
      setAuthError(err instanceof Error ? err.message : 'Unable to sync account.');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchAccount(user);
      } else {
        setAccount(null);
        setUserLogs([]);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [fetchAccount]);

  const signInWithGoogle = useCallback(async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      const credential = await signInWithPopup(auth, googleAuthProvider);
      await fetchAccount(credential.user);
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed before completion.');
      } else {
        setAuthError('Unable to complete Google sign-in. Please try again.');
      }
      return false;
    } finally {
      setAuthBusy(false);
    }
  }, [fetchAccount]);

  const signOutUser = useCallback(async () => {
    setAuthBusy(true);
    try {
      await signOut(auth);
      setAccount(null);
      setUserLogs([]);
      setAuthError(null);
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const getToken = useCallback(async () => {
    if (!firebaseUser) return null;
    return firebaseUser.getIdToken();
  }, [firebaseUser]);

  const refreshAccount = useCallback(async () => {
    if (firebaseUser) {
      await fetchAccount(firebaseUser);
    }
  }, [firebaseUser, fetchAccount]);

  const saveProfileToServer = useCallback(
    async (payload: { displayName: string; jurisdiction: string }) => {
      if (!firebaseUser) return false;
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/me/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || 'Failed to save profile.');
      }
      await fetchAccount(firebaseUser);
      return true;
    },
    [firebaseUser, fetchAccount]
  );

  const saveSettingsToServer = useCallback(
    async (payload: {
      notifySecurity: boolean;
      notifyKyc: boolean;
      notifyPlatform: boolean;
    }) => {
      if (!firebaseUser) return false;
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/me/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || 'Failed to save settings.');
      }
      const data = await response.json();
      if (data.user) {
        setAccount(data.user);
      }
      return true;
    },
    [firebaseUser]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      account,
      userLogs,
      authReady,
      authBusy,
      authError,
      signInWithGoogle,
      signOutUser,
      getToken,
      refreshAccount,
      saveProfileToServer,
      saveSettingsToServer,
    }),
    [
      firebaseUser,
      account,
      userLogs,
      authReady,
      authBusy,
      authError,
      signInWithGoogle,
      signOutUser,
      getToken,
      refreshAccount,
      saveProfileToServer,
      saveSettingsToServer,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
