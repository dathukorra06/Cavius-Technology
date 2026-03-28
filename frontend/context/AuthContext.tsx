'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: object) => Promise<void>;
  logout: () => void;
  updateUser: (data: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (savedToken: string) => {
    try {
      const res = await authApi.getMe();
      setUser(res.data.data);
    } catch {
      Cookies.remove('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = Cookies.get('token');
    if (saved) {
      setToken(saved);
      loadUser(saved);
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { token: t, user: u } = res.data.data;
    Cookies.set('token', t, { expires: 7 });
    setToken(t);
    setUser(u);
  };

  const register = async (data: object) => {
    const res = await authApi.register(data);
    const { token: t, user: u } = res.data.data;
    Cookies.set('token', t, { expires: 7 });
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    Cookies.remove('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data: User) => setUser(data);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
