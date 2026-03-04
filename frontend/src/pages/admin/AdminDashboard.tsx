import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import useFetchProducts from '@/hooks/products/useFetchProducts';
import AdminStatistics from '@/components/admin/AdminStatistics';
import ProductsTable from '@/components/admin/ProductsTable';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, loading } = useFetchProducts();

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    // TODO: Implementar eliminación con API
    toast.info('Función de eliminación próximamente');
  };

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum: number, p: any) => sum + p.price * p.stock,
    0
  );
  const lowStockProducts = products.filter((p: any) => p.stock < 10).length;

  return (
    <div className="from-muted/30 to-background min-h-screen bg-gradient-to-br">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="from-primary to-accent mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus productos y visualiza estadísticas
          </p>
        </div>

        {/* Estadísticas */}
        <AdminStatistics
          totalProducts={totalProducts}
          totalValue={totalValue}
          lowStockProducts={lowStockProducts}
        />

        {/* Tabla de productos */}
        <ProductsTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          isLoading={loading}
        />
      </main>
    </div>
  );
}
