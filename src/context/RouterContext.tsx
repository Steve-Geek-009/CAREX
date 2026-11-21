import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { normalizePath, resolveRoute, type RouteDefinition } from '../utils/routing';

interface RouterContextValue {
  currentPath: string;
  route: RouteDefinition;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname || '/')
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname || '/'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const route = useMemo(() => resolveRoute(currentPath), [currentPath]);

  useEffect(() => {
    document.title = route.title;
  }, [route.title]);

  const navigate = useCallback((targetPath: string) => {
    const normalized = normalizePath(targetPath);
    if (window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const value = useMemo(
    () => ({ currentPath: route.path, route, navigate }),
    [route, navigate]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used inside RouterProvider');
  }
  return ctx;
}
