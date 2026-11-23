import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import type { AccountStatus, UserRole } from '../utils/rbac';

export interface AuthenticatedAccount {
  id: number;
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  jurisdiction: string;
  role: UserRole;
  accountStatus: AccountStatus;
  kycStatus: string;
  walletStatus: string;
  walletAddress: string | null;
  notifySecurity: boolean;
  notifyKyc: boolean;
  notifyPlatform: boolean;
  createdAt: string;
  lastLoginAt: string;
  updatedAt: string;
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

export interface AdminMetricsSummary {
  totalUsers: number;
  activeUsers: number;
  underReviewUsers: number;
  restrictedUsers: number;
  adminUsers: number;
}

export interface AdminOverviewData {
  metrics: AdminMetricsSummary;
  users: AuthenticatedAccount[];
  activityLogs: PersistedActivityLog[];
}

export interface SignInResult {
  ok: boolean;
  restricted?: boolean;
  role?: UserRole;
}

interface AuthContextValue {
  firebaseUser: User | null;
  account: AuthenticatedAccount | null;
  userLogs: PersistedActivityLog[];
  authReady: boolean;
  authBusy: boolean;
  authError: string | null;
  restrictedReason: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<SignInResult>;
  signOutUser: () => Promise<void>;
  refreshAccount: () => Promise<void>;
  saveProfileToServer: (payload: { displayName: string; jurisdiction: string }) => Promise<boolean>;
  saveSettingsToServer: (payload: {
    notifySecurity: boolean;
    notifyKyc: boolean;
    notifyPlatform: boolean;
  }) => Promise<boolean>;
  fetchAdminOverview: () => Promise<AdminOverviewData>;
  updateAdminUserStatus: (targetUid: string, nextStatus: AccountStatus) => Promise<AuthenticatedAccount>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseSignInError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled before completion.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Allow popups for this site and try again.';
    case 'auth/network-request-failed':
      return 'Network error while contacting Google authentication. Check your connection and try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Authentication settings.';
    case 'auth/invalid-credential':
    case 'auth/user-disabled':
      return 'Your Google account credentials could not be verified. Please contact support.';
    default:
      return err instanceof Error && err.message
        ? err.message
        : 'Unable to complete Google sign-in. Please try again.';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [account, setAccount] = useState<AuthenticatedAccount | null>(null);
  const [userLogs, setUserLogs] = useState<PersistedActivityLog[]>([]);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [restrictedReason, setRestrictedReason] = useState<string | null>(null);

  // Prevents duplicate automatic sync while an explicit login call is handling POST /api/auth/session.
  const explicitSignInActiveRef = useRef(false);

  const authorizedFetch = useCallback(
    async (user: User, input: string, init: RequestInit = {}): Promise<Response> => {
      const sendWithToken = async (forceRefresh: boolean) => {
        const idToken = await user.getIdToken(forceRefresh);
        const headers = new Headers(init.headers ?? {});
        headers.set('Authorization', `Bearer ${idToken}`);
        return fetch(input, { ...init, headers });
      };

      const firstResponse = await sendWithToken(false);
      if (firstResponse.status === 401) {
        // Attempt a single forced token refresh in case the cached ID token expired.
        return sendWithToken(true);
      }
      return firstResponse;
    },
    []
  );

  const syncAccountFromBackend = useCallback(
    async (
      user: User,
      mode: 'login' | 'restore'
    ): Promise<{ ok: boolean; restricted?: boolean; account?: AuthenticatedAccount }> => {
      const endpoint = mode === 'login' ? '/api/auth/session' : '/api/me';
      const method = mode === 'login' ? 'POST' : 'GET';

      try {
        const response = await authorizedFetch(user, endpoint, { method });
        const body = await response.json().catch(() => ({}));

        if (response.status === 401) {
          await signOut(auth).catch(() => {});
          setFirebaseUser(null);
          setAccount(null);
          setUserLogs([]);
          setRestrictedReason(null);
          setAuthError(
            body.error || 'Your authentication session expired. Please sign in again with Google.'
          );
          return { ok: false };
        }

        if (response.status === 403 && body.code === 'ACCOUNT_RESTRICTED') {
          setAccount(null);
          setUserLogs([]);
          setAuthError(null);
          setRestrictedReason(
            body.error || 'Your CAREX account is restricted. Contact CAREX compliance support.'
          );
          return { ok: false, restricted: true };
        }

        if (!response.ok) {
          const message =
            body.error ||
            'Unable to verify your CAREX account with the backend. Please try again shortly.';
          // Fail closed: do not leave a half-authenticated session when backend verification fails.
          if (mode === 'login') {
            await signOut(auth).catch(() => {});
            setFirebaseUser(null);
          }
          setAccount(null);
          setUserLogs([]);
          setRestrictedReason(null);
          setAuthError(message);
          return { ok: false };
        }

        const verifiedAccount = (body.user ?? null) as AuthenticatedAccount | null;
        setAccount(verifiedAccount);
        setUserLogs(Array.isArray(body.activityLogs) ? body.activityLogs : []);
        setRestrictedReason(null);
        setAuthError(null);
        return { ok: Boolean(verifiedAccount), account: verifiedAccount ?? undefined };
      } catch {
        if (mode === 'login') {
          await signOut(auth).catch(() => {});
          setFirebaseUser(null);
        }
        setAccount(null);
        setUserLogs([]);
        setRestrictedReason(null);
        setAuthError(
          'Network error while verifying your session with the CAREX backend. Please try again.'
        );
        return { ok: false };
      }
    },
    [authorizedFetch]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        if (!explicitSignInActiveRef.current) {
          await syncAccountFromBackend(user, 'restore');
        }
      } else {
        setAccount(null);
        setUserLogs([]);
        setRestrictedReason(null);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [syncAccountFromBackend]);

  const signInWithGoogle = useCallback(async (): Promise<SignInResult> => {
    setAuthBusy(true);
    setAuthError(null);
    setRestrictedReason(null);
    explicitSignInActiveRef.current = true;
    try {
      const credential = await signInWithPopup(auth, googleAuthProvider);
      setFirebaseUser(credential.user);
      const result = await syncAccountFromBackend(credential.user, 'login');
      return {
        ok: result.ok,
        restricted: result.restricted,
        role: result.account?.role,
      };
    } catch (err: unknown) {
      setAuthError(mapFirebaseSignInError(err));
      return { ok: false };
    } finally {
      explicitSignInActiveRef.current = false;
      setAuthBusy(false);
    }
  }, [syncAccountFromBackend]);

  const signOutUser = useCallback(async () => {
    setAuthBusy(true);
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setAccount(null);
      setUserLogs([]);
      setRestrictedReason(null);
      setAuthError(null);
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const refreshAccount = useCallback(async () => {
    if (firebaseUser) {
      await syncAccountFromBackend(firebaseUser, 'restore');
    }
  }, [firebaseUser, syncAccountFromBackend]);

  const saveProfileToServer = useCallback(
    async (payload: { displayName: string; jurisdiction: string }) => {
      if (!firebaseUser) {
        throw new Error('You must sign in with Google before updating your profile.');
      }
      const response = await authorizedFetch(firebaseUser, '/api/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));

      if (response.status === 401) {
        await signOutUser();
        throw new Error(body.error || 'Session expired. Please sign in again.');
      }
      if (response.status === 403 && body.code === 'ACCOUNT_RESTRICTED') {
        setAccount(null);
        setRestrictedReason(body.error || 'Your CAREX account is restricted.');
        throw new Error(body.error || 'Your CAREX account is restricted.');
      }
      if (!response.ok) {
        throw new Error(body.error || 'Failed to save profile.');
      }
      await syncAccountFromBackend(firebaseUser, 'restore');
      return true;
    },
    [firebaseUser, authorizedFetch, signOutUser, syncAccountFromBackend]
  );

  const saveSettingsToServer = useCallback(
    async (payload: {
      notifySecurity: boolean;
      notifyKyc: boolean;
      notifyPlatform: boolean;
    }) => {
      if (!firebaseUser) {
        throw new Error('You must sign in with Google before updating account settings.');
      }
      const response = await authorizedFetch(firebaseUser, '/api/me/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));

      if (response.status === 401) {
        await signOutUser();
        throw new Error(body.error || 'Session expired. Please sign in again.');
      }
      if (response.status === 403 && body.code === 'ACCOUNT_RESTRICTED') {
        setAccount(null);
        setRestrictedReason(body.error || 'Your CAREX account is restricted.');
        throw new Error(body.error || 'Your CAREX account is restricted.');
      }
      if (!response.ok) {
        throw new Error(body.error || 'Failed to save settings.');
      }
      if (body.user) {
        setAccount(body.user as AuthenticatedAccount);
      }
      return true;
    },
    [firebaseUser, authorizedFetch, signOutUser]
  );

  const fetchAdminOverview = useCallback(async (): Promise<AdminOverviewData> => {
    if (!firebaseUser) {
      throw new Error('Authentication required.');
    }
    const response = await authorizedFetch(firebaseUser, '/api/admin/overview', {
      method: 'GET',
    });
    const body = await response.json().catch(() => ({}));

    if (response.status === 401) {
      await signOutUser();
      throw new Error(body.error || 'Your session expired. Please sign in again.');
    }
    if (!response.ok) {
      throw new Error(body.error || 'Unable to load administrative records.');
    }
    return body as AdminOverviewData;
  }, [firebaseUser, authorizedFetch, signOutUser]);

  const updateAdminUserStatus = useCallback(
    async (targetUid: string, nextStatus: AccountStatus): Promise<AuthenticatedAccount> => {
      if (!firebaseUser) {
        throw new Error('Authentication required.');
      }
      const response = await authorizedFetch(
        firebaseUser,
        `/api/admin/users/${encodeURIComponent(targetUid)}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountStatus: nextStatus }),
        }
      );
      const body = await response.json().catch(() => ({}));

      if (response.status === 401) {
        await signOutUser();
        throw new Error(body.error || 'Your session expired. Please sign in again.');
      }
      if (!response.ok) {
        throw new Error(body.error || 'Unable to update account status.');
      }
      return body.user as AuthenticatedAccount;
    },
    [firebaseUser, authorizedFetch, signOutUser]
  );

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      account,
      userLogs,
      authReady,
      authBusy,
      authError,
      restrictedReason,
      clearAuthError,
      signInWithGoogle,
      signOutUser,
      refreshAccount,
      saveProfileToServer,
      saveSettingsToServer,
      fetchAdminOverview,
      updateAdminUserStatus,
    }),
    [
      firebaseUser,
      account,
      userLogs,
      authReady,
      authBusy,
      authError,
      restrictedReason,
      clearAuthError,
      signInWithGoogle,
      signOutUser,
      refreshAccount,
      saveProfileToServer,
      saveSettingsToServer,
      fetchAdminOverview,
      updateAdminUserStatus,
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
