import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import apiFetch, { ApiError } from '@/utils/api';
import { setCredentials, clearCredentials } from '@/store/authSlice';
import type { AuthVerifyResult } from '@/interfaces/auth';

/**
 * Hook para verificar autenticación con el backend
 *
 * Hace una petición a /auth/me para validar el token httpOnly.
 * - Actualiza Redux con los datos reales del servidor
 * - Limpia Redux si el token es inválido
 * - Maneja estados de loading y error
 *
 * @returns {AuthVerifyResult} Estado de la verificación
 *
 * @example
 * const { isVerifying, isAuthenticated, isAdmin } = useAuthVerify();
 * if (isVerifying) return <Loader />;
 * if (!isAuthenticated) return <Navigate to="/login" />;
 */
export const useAuthVerify = (): AuthVerifyResult => {
  const dispatch = useDispatch();
  const [state, setState] = useState<AuthVerifyResult>({
    isVerifying: true,
    isAuthenticated: false,
    isAdmin: false,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const response = await apiFetch('/auth/me', {
          method: 'GET',
        });

        const result = await response.json();

        if (!result.data || !result.data.id) {
          throw new Error('Respuesta del servidor incompleta');
        }

        const { id, name, role } = result.data;

        // Actualizar Redux con datos reales del servidor
        dispatch(
          setCredentials({
            user: { id, name, role: role as 'user' | 'admin' },
            token: null, // El token está en cookie httpOnly
          })
        );

        if (isMounted) {
          setState({
            isVerifying: false,
            isAuthenticated: true,
            isAdmin: role === 'admin',
            error: null,
          });
        }
      } catch (error) {
        // Token inválido o no existe - limpiar Redux
        dispatch(clearCredentials());

        if (isMounted) {
          setState({
            isVerifying: false,
            isAuthenticated: false,
            isAdmin: false,
            error:
              error instanceof ApiError
                ? error.message
                : 'Error de autenticación',
          });
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return state;
};

export default useAuthVerify;
