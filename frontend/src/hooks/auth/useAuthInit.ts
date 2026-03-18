import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import apiFetch from '@/utils/api';
import { setCredentials, clearCredentials } from '@/store/authSlice';

/**
 * Hook para sincronizar el estado de autenticación con el backend al iniciar la app
 *
 * Ejecuta una verificación silenciosa (sin UI blocking) al montar el componente.
 * Útil para sincronizar Redux con el estado real del servidor al recargar la página.
 *
 * @example
 * // En RootLayout o App
 * useAuthInit();
 */
export const useAuthInit = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const response = await apiFetch('/auth/me', {
          method: 'GET',
        });

        const result = await response.json();

        if (result.data && result.data.id && isMounted) {
          const { id, name, role } = result.data;

          // Sincronizar Redux con el estado real del servidor
          dispatch(
            setCredentials({
              user: { id, name, role: role as 'user' | 'admin' },
              token: null, // El token está en cookie httpOnly
            })
          );
        }
      } catch {
        // Si falla, limpiar Redux silenciosamente
        // (puede que no haya sesión activa y eso está bien)
        if (isMounted) {
          dispatch(clearCredentials());
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};

export default useAuthInit;
