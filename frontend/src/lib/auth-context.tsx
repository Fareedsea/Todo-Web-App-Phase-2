// T024: Authentication Context and Provider

'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, setToken, removeToken } from './api-client';
import { AuthUser, LoginResponse, RegisterResponse } from '@/types/auth';
import { handleError, logError } from './error-handler';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validate token by fetching user info
          // For now, we'll just set a basic user object
          // In a real app, you'd validate the token with the backend
          const userEmail = localStorage.getItem('user_email');
          if (userEmail) {
            setUser({
              id: '', // Would be fetched from backend
              email: userEmail,
              createdAt: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        logError(err, 'Auth Check');
        removeToken();
        localStorage.removeItem('user_email');
      } finally {
        setIsInitialized(true);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);

      try {
        const response = await apiClient.auth.login(email, password) as LoginResponse;

        // Clear any stale cache data before setting new user
        // This prevents showing previous user's data to the new user
        const { queryClient } = await import('./query-client');
        queryClient.clear();

        // Store token and user info
        setToken(response.token);
        localStorage.setItem('user_email', response.user.email);
        setUser(response.user);

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        const errorResult = handleError(err);
        setError(errorResult.message);
        logError(err, 'Login');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);

      try {
        const response = await apiClient.auth.register(email, password) as RegisterResponse;

        // Clear any stale cache data before setting new user
        // This ensures a clean state for the newly registered user
        const { queryClient } = await import('./query-client');
        queryClient.clear();

        // Store token and user info
        setToken(response.token);
        localStorage.setItem('user_email', response.user.email);
        setUser(response.user);

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        const errorResult = handleError(err);
        setError(errorResult.message);
        logError(err, 'Register');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setError(null);

    // Clear local state immediately
    removeToken();
    localStorage.removeItem('user_email');
    setUser(null);

    // CRITICAL: Clear all cached data to prevent data leakage between users
    // This ensures tasks and user data from the previous session are completely removed
    const { queryClient } = await import('./query-client');
    queryClient.clear();

    // Redirect to sign-in
    router.push('/sign-in');
  }, [router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
