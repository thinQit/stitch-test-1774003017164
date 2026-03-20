'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

function parseJwt(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    } as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (storedToken) {
      setToken(storedToken);
      setUser(parseJwt(storedToken));
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, newToken);
    }
    setToken(newToken);
    setUser(parseJwt(newToken));
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
