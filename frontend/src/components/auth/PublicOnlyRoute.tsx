import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { PublicOnlyRouteProps } from '@/interfaces/auth';

/**
 * PublicOnlyRoute Component
 *
 * Protege rutas que solo deben ser accesibles para usuarios NO autenticados (como login/register).
 * Redirige a la página apropiada si el usuario ya está autenticado:
 * - Admin -> /admin
 * - User -> /
 *
 * @example
 * <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
 */
export const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  // Si está autenticado, redirigir según el rol
  if (isLoggedIn && user) {
    const redirectTo = user.role === 'admin' ? '/admin' : '/';
    return <Navigate to={redirectTo} replace />;
  }

  // Usuario no autenticado, renderizar children (login/register)
  return <>{children}</>;
};

export default PublicOnlyRoute;
