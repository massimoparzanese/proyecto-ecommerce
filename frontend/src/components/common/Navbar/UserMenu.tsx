import { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { UserMenuButton } from './UserMenuButton';
import { GuestMenuItems } from './GuestMenuItems';
import { AuthenticatedMenuItems } from './AuthenticatedMenuItems';

/**
 * Menú desplegable de usuario
 * Muestra diferentes opciones según el estado de autenticación
 */
export const UserMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const isLoggedIn = useAuth();

  const closeMenu = () => setShowMenu(false);
  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <div className="relative">
      {/* Overlay para cerrar el menú al hacer click fuera */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <UserMenuButton onClick={toggleMenu} isExpanded={showMenu} />

      {showMenu && (
        <div className="border-border text-popover-foreground absolute right-0 z-50 mt-1 w-56 rounded-lg border bg-popover py-2 shadow-lg">
          {isLoggedIn ? (
            <AuthenticatedMenuItems onClose={closeMenu} />
          ) : (
            <GuestMenuItems />
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
