import { NavbarLogo, UserMenu, CartPreview } from './Navbar/index';
import { ThemeToggle } from './ThemeToggle';

/**
 * Navbar principal de la aplicación
 * - Logo que redirige según el rol del usuario
 * - Menú de usuario con opciones contextuales
 */
export default function Navbar() {
  return (
    <nav className="border-border supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b bg-background/95 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavbarLogo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <CartPreview />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
