// auth/context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { AuthResponse, LoginCredentials, User, UserMe } from '@/lib/utils/types';
import { getToken, setToken } from '@/lib/utils/utils';

interface AuthContextType {
  user: UserMe | null;
  isLoading: boolean;
  isLoggingIn: boolean;
  login: (credentials: LoginCredentials) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(null);

  // Initialize token from storage
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, [setTokenState]);

  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      return fetchWithAuth<any>('/users/get-me').then(res => res.result) as Promise<UserMe>
    },
    enabled: !!token,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      fetchWithAuth<AuthResponse>('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    onSuccess: (res) => {
      setTokenState(res.result.token);
      setToken(res.result.token);
      queryClient.setQueryData(['user'], res.result);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isLoggingIn: loginMutation.isPending,
        login: loginMutation.mutateAsync,
        logout: () => {
          setTokenState(null);
          setToken(null);
          queryClient.clear();
        },
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}