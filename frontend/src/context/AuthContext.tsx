import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMe, login as apiLogin, register as apiRegister } from '../api/authApi';

interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password);
      const authToken = data.token;
      localStorage.setItem('authToken', authToken);
      setToken(authToken);
      setUser(data.user);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await apiRegister(username, email, password);
      const authToken = data.token;
      localStorage.setItem('authToken', authToken);
      setToken(authToken);
      setUser(data.user);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(user), loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
