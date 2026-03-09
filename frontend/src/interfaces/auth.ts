import type { ReactNode } from 'react';

export interface AuthState {
  user: { id: string; name: string; role?: 'user' | 'admin' } | null;
  token: string | null;
  isLoggedIn?: boolean;
}

export interface AuthVerifyResult {
  isVerifying: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: string | null;
}

export interface AuthLoadingProps {
  message?: string;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface AdminRouteProps {
  children: ReactNode;
}

export interface PublicOnlyRouteProps {
  children: ReactNode;
}
