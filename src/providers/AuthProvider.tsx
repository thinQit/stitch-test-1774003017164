'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

type LoginResult = {
  success: boolean;
  message?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_KEY = 'pf_admin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) : null;
    setIsAuthenticated(Boolean(stored));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setLoading(true);
    const res = await api.post<{ success?: boolean; message?: string }>('/api/login', { email, password });
    setLoading(false);

    if (res.error) {
      return { success: false, message: res.error };
    }

    if (res.data?.success === false) {
      return { success: false, message: res.data.message || 'Login failed' };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, 'true');
    }
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      loading,
      login,
      logout
    }),
    [isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
