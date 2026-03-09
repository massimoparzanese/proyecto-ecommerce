import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import useFetchProducts from '@/hooks/products/useFetchProducts';
import AdminStatistics from '@/components/admin/AdminStatistics';
import ProductsTable from '@/components/admin/ProductsTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import apiFetch from '@/utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, loading, refetch } = useFetchProducts();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/product/${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await apiFetch(`/products/${productToDelete}`, {
        method: 'DELETE',
      });

      await response.json(); // Consumir respuesta
      toast.success('Producto eliminado exitosamente');

      // Recargar productos
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al eliminar producto';
      toast.error(errorMessage);
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  return (
    <div className="from-muted/30 to-background min-h-screen bg-linear-to-br">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="from-primary to-accent mb-2 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent">
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

        {/* Diálogo de confirmación de eliminación */}
        <ConfirmDialog
          isOpen={deleteDialogOpen}
          title="Eliminar Producto"
          description="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={confirmDeleteProduct}
          onCancel={cancelDelete}
        />
      </main>
    </div>
  );
}
