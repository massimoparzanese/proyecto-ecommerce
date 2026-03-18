import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export const useCart = () => {
  const itemsMap = useSelector((state: RootState) => state.cart.items);

  const items = useMemo(() => Object.values(itemsMap), [itemsMap]);

  const totalQuantity = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const previewItems = useMemo(() => items.slice(0, 3), [items]);

  return {
    items,
    previewItems,
    totalQuantity,
    subtotal,
    isEmpty: items.length === 0,
  };
};

export default useCart;
