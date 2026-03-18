import { Link } from 'react-router-dom';
import { Shield, BarChart3, Package } from 'lucide-react';

/**
 * Items del menú específicos para administradores
 */
export const AdminMenuItems = () => {
  return (
    <>
      <div className="border-border border-b px-4 py-2">
        <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase">
          <Shield className="h-3 w-3" />
          Administración
        </p>
      </div>
      <Link
        to="/admin"
        className="hover:bg-muted/50 flex items-center gap-2 px-4 py-2 transition-colors"
      >
        <BarChart3 className="h-4 w-4" />
        Panel de Control
      </Link>
      <Link
        to="/admin/product"
        className="hover:bg-muted/50 flex items-center gap-2 px-4 py-2 transition-colors"
      >
        <Package className="h-4 w-4" />
        Gestionar Productos
      </Link>
    </>
  );
};

export default AdminMenuItems;
