import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, type LoginPayload, type RegisterPayload } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth state from storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('user_id');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    try {
      const response = await apiLogin(payload);

      if (response.status && response.data) {
        const authToken = response.data.api_token || response.data.token || response.token || response.api_token || '';
        const userData: User = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          profileImage: response.data.profile_image,
        };

        setToken(authToken);
        setUser(userData);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('user_id', String(userData.id));

        return { success: true, message: response.message || 'Login successful' };
      }

      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const response = await apiRegister(payload);

      if (response.status && response.data) {
        const authToken = response.data.api_token || response.data.token || response.token || response.api_token || '';
        const userData: User = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          profileImage: response.data.profile_image,
        };

        setToken(authToken);
        setUser(userData);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('user_id', String(userData.id));

        return { success: true, message: response.message || 'Registration successful' };
      }

      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, message };
    }
  }, []);

  const logoutFn = useCallback(async () => {
    try {
      if (token) {
        await apiLogout();
      }
    } catch {
      // Ignore logout errors
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('user_id');
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout: logoutFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
