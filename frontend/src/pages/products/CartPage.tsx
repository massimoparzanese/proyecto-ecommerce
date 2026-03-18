import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/common/button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import CartEmptyState from '@/components/products/cart/CartEmptyState';
import CartItemCard from '@/components/products/cart/CartItemCard';
import CartSummaryCard from '@/components/products/cart/CartSummaryCard';
import { useAuth } from '@/hooks/auth/useAuth';
import useCart from '@/hooks/cart/useCart';
import {
  clearCart,
  decreaseItem,
  increaseItem,
  removeItem,
} from '@/store/cartSlice';
import { toast } from 'sonner';

export default function CartPage() {
  const dispatch = useDispatch();
  const isLoggedIn = useAuth();
  const { items, totalQuantity, subtotal, isEmpty } = useCart();
  const [itemToRemove, setItemToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const itemsListText = useMemo(
    () => items.map(item => item.name).join(', '),
    [items]
  );

  if (!isLoggedIn) {
    return (
      <Navigate to="/login" replace state={{ from: { pathname: '/cart' } }} />
    );
  }

  const handleCheckout = () => {
    if (isEmpty) {
      toast.error('Tu carrito esta vacio');
      return;
    }

    toast.info('Pago en desarrollo. Pronto podras finalizar tu compra aqui.');
  };

  const openRemoveDialog = (id: string, name: string) => {
    setItemToRemove({ id, name });
  };

  const confirmRemoveItem = () => {
    if (!itemToRemove) {
      return;
    }

    dispatch(removeItem(itemToRemove.id));
    toast.success(`Producto "${itemToRemove.name}" eliminado del carrito`);
    setItemToRemove(null);
  };

  const cancelRemoveItem = () => {
    setItemToRemove(null);
  };

  const openClearDialog = () => {
    setClearDialogOpen(true);
  };

  const confirmClearCart = () => {
    dispatch(clearCart());
    toast.success('Carrito vaciado correctamente');
    setClearDialogOpen(false);
  };

  const cancelClearCart = () => {
    setClearDialogOpen(false);
  };

  return (
    <section className="from-muted/30 to-background min-h-full bg-linear-to-br">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Tu carrito</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Revisa tus productos antes de comprar.
            </p>
          </div>

          {!isEmpty && (
            <Button variant="outline" onClick={openClearDialog}>
              <Trash2 className="mr-2 h-4 w-4" />
              Vaciar carrito
            </Button>
          )}
        </div>

        {isEmpty ? (
          <CartEmptyState />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map(item => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  onDecrease={productId => dispatch(decreaseItem(productId))}
                  onIncrease={productId => dispatch(increaseItem(productId))}
                  onRemove={openRemoveDialog}
                />
              ))}
            </div>

            <CartSummaryCard
              totalQuantity={totalQuantity}
              subtotal={subtotal}
              onCheckout={handleCheckout}
            />
          </div>
        )}

        <ConfirmDialog
          isOpen={Boolean(itemToRemove)}
          title="Eliminar producto"
          description={`¿Estas seguro de eliminar "${itemToRemove?.name ?? ''}" del carrito?`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={confirmRemoveItem}
          onCancel={cancelRemoveItem}
        />

        <ConfirmDialog
          isOpen={clearDialogOpen}
          title="Vaciar carrito"
          description={`¿Estas seguro de eliminar todos los productos del carrito? Productos: ${itemsListText}`}
          confirmLabel="Vaciar carrito"
          cancelLabel="Cancelar"
          variant="warning"
          onConfirm={confirmClearCart}
          onCancel={cancelClearCart}
        />
      </div>
    </section>
  );
}
