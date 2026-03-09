import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '@/store/authSlice';
import apiFetch from '@/utils/api';
import { toast } from 'sonner';
import { useIsAdmin } from '@/hooks/auth/useAuth';
import { AdminMenuItems } from './AdminMenuItems';
import type { AuthenticatedMenuItemsProps } from '@/interfaces/navbar';

/**
 * Items del menú para usuarios autenticados
 * Incluye opciones de admin si corresponde y logout
 */
export const AuthenticatedMenuItems = ({
  onClose,
}: AuthenticatedMenuItemsProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = useIsAdmin();

  const handleLogout = async () => {
    try {
      const response = await apiFetch('auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        toast.error('Error al cerrar sesión');
      } else {
        toast.success('Sesión cerrada');
        dispatch(clearCredentials());
        navigate('/');
        onClose();
      }
    } catch {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <>
      {isAdmin && <AdminMenuItems />}

      {isAdmin && <div className="border-border my-1 border-t" />}

      <button
        onClick={handleLogout}
        className="text-muted-foreground hover:bg-foreground bg-muted/50 flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Cerrar Sesión
      </button>
    </>
  );
};

export default AuthenticatedMenuItems;
