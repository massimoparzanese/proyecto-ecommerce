export interface CartItem {
  productId: string;
  name: string;
  shortDescription: string;
  price: number;
  image?: string;
  stock: number;
  quantity: number;
}

export interface CartState {
  items: Record<string, CartItem>;
}

export interface UpdateCartItemQuantityPayload {
  productId: string;
  quantity: number;
}

export interface CartEmptyStateProps {
  productsPath?: string;
}

export interface CartItemCardProps {
  item: CartItem;
  onDecrease: (productId: string) => void;
  onIncrease: (productId: string) => void;
  onRemove: (productId: string, productName: string) => void;
}

export interface CartSummaryCardProps {
  totalQuantity: number;
  subtotal: number;
  onCheckout: () => void;
}
