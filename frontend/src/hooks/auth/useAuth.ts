import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

/**
 * Hook para verificar si el usuario está autenticado
 *
 * @returns boolean - true si el usuario está autenticado
 *
 * }
 */
export const useAuth = (): boolean => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  return Boolean(isLoggedIn && user);
};

/**
 * Hook para verificar si el usuario es administrador
 *
 * @returns boolean - true si el usuario es admin
 */
export const useIsAdmin = (): boolean => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  return Boolean(isLoggedIn && user && user.role === 'admin');
};

/**
 * Hook para obtener el usuario actual
 *
 * @returns User object or null
 */
export const useCurrentUser = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user;
};
