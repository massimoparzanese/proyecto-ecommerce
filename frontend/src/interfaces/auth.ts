export interface AuthState {
  user: { id: string; name: string; role?: 'user' | 'admin' } | null;
  token: string | null;
  isLoggedIn?: boolean;
}
