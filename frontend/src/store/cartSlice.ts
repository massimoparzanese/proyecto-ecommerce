import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/interfaces/product';
import type {
  CartState,
  UpdateCartItemQuantityPayload,
} from '@/interfaces/cart';

const initialState: CartState = {
  items: {},
};

const truncateDescription = (value: string, max = 100) => {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max).trim()}...`;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existingItem = state.items[product.id];
      const currentQuantity = existingItem?.quantity ?? 0;

      if (product.stock <= 0 || currentQuantity >= product.stock) {
        return;
      }

      state.items[product.id] = {
        productId: product.id,
        name: product.name,
        shortDescription: truncateDescription(product.description),
        price: product.price,
        image: product.images?.[0],
        stock: product.stock,
        quantity: currentQuantity + 1,
      };
    },
    decreaseItem(state, action: PayloadAction<string>) {
      const productId = action.payload;
      const existingItem = state.items[productId];

      if (!existingItem) {
        return;
      }

      if (existingItem.quantity <= 1) {
        delete state.items[productId];
        return;
      }

      existingItem.quantity -= 1;
    },
    increaseItem(state, action: PayloadAction<string>) {
      const productId = action.payload;
      const existingItem = state.items[productId];

      if (!existingItem || existingItem.quantity >= existingItem.stock) {
        return;
      }

      existingItem.quantity += 1;
    },
    setItemQuantity(
      state,
      action: PayloadAction<UpdateCartItemQuantityPayload>
    ) {
      const { productId, quantity } = action.payload;
      const existingItem = state.items[productId];

      if (!existingItem) {
        return;
      }

      const normalizedQuantity = Math.max(
        0,
        Math.min(quantity, existingItem.stock)
      );

      if (normalizedQuantity === 0) {
        delete state.items[productId];
        return;
      }

      existingItem.quantity = normalizedQuantity;
    },
    removeItem(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    clearCart(state) {
      state.items = {};
    },
  },
});

export const {
  addItem,
  decreaseItem,
  increaseItem,
  setItemQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
