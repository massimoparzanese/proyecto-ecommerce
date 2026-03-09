import { Navigate, useLocation } from 'react-router-dom';
import { useAuthVerify } from '@/hooks/auth/useAuthVerify';
import { AuthLoading } from './AuthLoading';
import type { ProtectedRouteProps } from '@/interfaces/auth';

/**
 * ProtectedRoute Component
 *
 * Protege rutas que requieren autenticación.
 * Verifica con el backend antes de renderizar.
 * Redirige a /login si el usuario no está autenticado, preservando la URL de destino.
 *
 * @example
 * <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isVerifying, isAuthenticated } = useAuthVerify();

  // Mostrar loading mientras verifica con el backend
  if (isVerifying) {
    return <AuthLoading />;
  }

  // Si no está autenticado (verificado con backend), redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuario autenticado (verificado con backend), renderizar children
  return <>{children}</>;
};

export default ProtectedRoute;
