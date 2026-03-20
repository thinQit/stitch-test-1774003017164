"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { AuthState, User } from "@/types";

type AuthContextValue = AuthState & {
  signIn: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = (nextUser: User) => {
    setIsLoading(true);
    setUser(nextUser);
    setIsLoading(false);
  };

  const signOut = () => {
    setIsLoading(true);
    setUser(null);
    setIsLoading(false);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signOut,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
