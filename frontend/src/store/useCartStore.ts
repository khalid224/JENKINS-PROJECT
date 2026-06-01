import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../utils/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  promoDiscount: number;
  promoCode: string;

  addItem: (product: Product, size: string, qty?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  applyPromo: (discount: number, code: string) => void;
  clearPromo: () => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
  discountAmount: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoDiscount: 0,
      promoCode: '',

      addItem: (product, size, qty = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.selectedSize === size
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.selectedSize === size
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product, selectedSize: size, quantity: qty }],
          };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.selectedSize === size)
          ),
        }));
      },

      updateQuantity: (productId, size, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.selectedSize === size
              ? { ...i, quantity: qty }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], promoDiscount: 0, promoCode: '' }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCartOpen: (open) => set({ isOpen: open }),

      applyPromo: (discount, code) => set({ promoDiscount: discount, promoCode: code }),

      clearPromo: () => set({ promoDiscount: 0, promoCode: '' }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      discountAmount: () => {
        const sub = get().subtotal();
        return Math.round((sub * get().promoDiscount) / 100);
      },

      total: () => get().subtotal() - get().discountAmount(),
    }),
    {
      name: 'tx-cart-storage',
      partialize: (state) => ({
        items: state.items,
        promoDiscount: state.promoDiscount,
        promoCode: state.promoCode,
      }),
    }
  )
);
