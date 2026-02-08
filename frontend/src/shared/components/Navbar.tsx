import { ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '@/store/authSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = useSelector((s: any) => s.auth?.isLoggedIn);
  const userRole = useSelector((s: any) => s.auth?.user?.role) as
    | 'user'
    | 'admin'
    | null;

  const handleLogout = () => {
    // clear redux state (redux-persist will update storage)
    dispatch(clearCredentials());
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="border-border sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="from-primary to-accent flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-xl font-semibold text-transparent">
              TiendaOnline
            </span>
          </Link>

          {/* Menú de usuario */}
          <div className="relative">
            {/* overlay to catch outside clicks when menu is open (no global listeners) */}
            {showUserMenu && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
                aria-hidden
              />
            )}
            <button
              type="button"
              onClick={() => setShowUserMenu(s => !s)}
              className="flex items-center space-x-2 rounded-lg bg-transparent px-4 py-2 transition-colors"
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
            >
              <div className="from-primary to-accent flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br shadow">
                <User className="h-4 w-4 text-white" />
              </div>
              {isLoggedIn && <span className="text-sm">Mi Cuenta</span>}
            </button>

            {showUserMenu && (
              <div className="border-border absolute right-0 z-50 mt-1 w-48 rounded-lg border bg-white py-2 shadow-lg">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="hover:bg-muted/50 block px-4 py-2 transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="hover:bg-muted/50 block px-4 py-2 transition-colors"
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    {userRole === 'admin' && (
                      <Link
                        to="/admin"
                        className="hover:bg-muted/50 block px-4 py-2 transition-colors"
                      >
                        Panel de Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="hover:bg-muted/50 text-destructive block w-full px-4 py-2 text-left transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
