'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthUser = {
  id: string;
  email: string;
} | null;

type AuthContextValue = {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading] = useState(false);

  const value = useMemo(() => ({ user, setUser, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthProvider;
