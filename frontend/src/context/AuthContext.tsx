import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../services/api';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username?: string; email?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdmin() {
      const stored = getAuthToken();
      if (!stored) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.admin) {
          setAdmin(res.admin);
          setToken(stored);
        }
      } catch (err: any) {
        const isAuthError = err?.isAuthError || err?.status === 401 || err?.status === 403;
        if (isAuthError) {
          console.warn('[Auth] Token invalid or expired:', err.message || err);
          clearAuthToken();
          setToken(null);
          setAdmin(null);
        } else {
          // Backend or API network is temporarily unreachable (e.g. server starting, offline)
          // Do NOT clear the token on transient network errors!
          console.warn('[Auth] Backend API unreachable during session validation. Preserving token for reconnect:', err.message || err);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadAdmin();
  }, []);

  const login = async (credentials: { username?: string; email?: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await api.login(credentials);
      setAuthToken(res.token);
      setToken(res.token);
      setAdmin(res.admin);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      clearAuthToken();
      setToken(null);
      setAdmin(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await api.getMe();
      if (res.admin) {
        setAdmin(res.admin);
      }
    } catch (err) {
      console.error('[Auth] Error refreshing profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: Boolean(admin && token),
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
