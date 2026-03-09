import { Navigate, useLocation } from 'react-router-dom';
import { useAuthVerify } from '@/hooks/auth/useAuthVerify';
import { AuthLoading } from './AuthLoading';
import type { AdminRouteProps } from '@/interfaces/auth';

/**
 * AdminRoute Component
 *
 * Protege rutas que requieren rol de administrador.
 * Verifica con el backend antes de renderizar.
 * - Redirige a /login si el usuario no está autenticado
 * - Redirige a / (home) si el usuario está autenticado pero no es admin
 *
 * @example
 * <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
 */
export const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  const { isVerifying, isAuthenticated, isAdmin } = useAuthVerify();

  // Mostrar loading mientras verifica con el backend
  if (isVerifying) {
    return <AuthLoading message="Verificando permisos de administrador..." />;
  }

  // Si no está autenticado (verificado con backend), redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado pero no es admin (verificado con backend), redirigir a home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado y es admin (verificado con backend), renderizar children
  return <>{children}</>;
};

export default AdminRoute;
