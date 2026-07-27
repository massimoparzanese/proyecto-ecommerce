import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/common/button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import CartPreviewList from './CartPreviewList';
import { useAuth } from '@/hooks/auth/useAuth';
import useCart from '@/hooks/cart/useCart';
import { clearCart } from '@/store/cartSlice';

export const CartPreview = () => {
  const [open, setOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useAuth();
  const { items, previewItems, totalQuantity, subtotal, isEmpty } = useCart();

  const itemsListText = items.map(item => item.name).join(', ');

  if (!isLoggedIn) {
    return null;
  }

  const handleOpenCart = () => {
    setOpen(false);
    navigate('/cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setConfirmClearOpen(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`relative rounded-lg p-2 transition-colors ${
          open
            ? 'bg-primary/20 text-primary'
            : 'bg-primary/10 text-primary hover:bg-accent/20 hover:text-accent'
        }`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Abrir carrito"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalQuantity > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold">
            {totalQuantity}
          </span>
        )}
      </button>

      {open && (
        <div className="border-border text-popover-foreground absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-popover p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Tu carrito</h3>
            {!isEmpty && (
              <button
                type="button"
                onClick={() => setConfirmClearOpen(true)}
                className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Vaciar
              </button>
            )}
          </div>

          {isEmpty ? (
            <p className="text-muted-foreground mb-4 text-sm">
              Aun no agregaste productos.
            </p>
          ) : (
            <>
              <CartPreviewList items={previewItems} />

              {items.length > previewItems.length && (
                <p className="text-muted-foreground mt-3 text-xs">
                  Mostrando 3 de {items.length} productos seleccionados.
                </p>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </>
          )}

          <div className="mt-4 space-y-2">
            <Button type="button" className="w-full" onClick={handleOpenCart}>
              Ver carrito completo
            </Button>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground block text-center text-xs"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmClearOpen}
        title="Vaciar carrito"
        description={`¿Estas seguro de eliminar todos los productos del carrito? Productos: ${itemsListText}`}
        confirmLabel="Vaciar carrito"
        cancelLabel="Cancelar"
        variant="warning"
        onConfirm={handleClearCart}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
};

export default CartPreview;
