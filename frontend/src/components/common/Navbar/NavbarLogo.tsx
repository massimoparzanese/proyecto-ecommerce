import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/auth/useAuth';

/**
 * Logo del Navbar que redirige según el rol del usuario
 * - Admin -> /admin
 * - Usuario normal o no autenticado -> /
 */
export const NavbarLogo = () => {
  const isAdmin = useIsAdmin();
  const homeUrl = isAdmin ? '/admin' : '/';

  return (
    <Link to={homeUrl} className="flex items-center space-x-2">
      <div className="from-primary to-accent flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
        <ShoppingCart className="h-5 w-5 text-white" />
      </div>
      <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-xl font-semibold text-transparent">
        TiendaOnline
      </span>
    </Link>
  );
};

export default NavbarLogo;
