import { Link } from 'react-router-dom';

/**
 * Items del menú para usuarios no autenticados
 */
export const GuestMenuItems = () => {
  return (
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
  );
};

export default GuestMenuItems;
