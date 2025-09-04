// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import * as cartActions from '@/lib/actions/cart';

// interface CartItem {
//   id: string;
//   productVariantId: string;
//   quantity: number;
//   name: string;
//   price: number;
//   image?: string;
//   size?: string;
//   color?: string;
// }

// interface CartState {
//   items: CartItem[];
//   total: number;
//   loading: boolean;
//   error: string | null;
//   fetchCart: () => Promise<void>;
//   addItem: (productVariantId: string, quantity?: number) => Promise<void>;
//   removeItem: (id: string) => Promise<void>;
//   updateQuantity: (id: string, quantity: number) => Promise<void>;
//   clearCart: () => Promise<void>;
//   getItemCount: () => number;
// }

// export const useCartStore = create<CartState>()(
//   persist(
//     (set, get) => ({
//       items: [],
//       total: 0,
//       loading: false,
//       error: null,
// fetchCart: async () => {
//   set({ loading: true, error: null });
//   try {
//     const cart = await cartActions.getCart();
//     if (cart) {
//       set({
//         items: cart.items.map(item => ({
//           id: item.id,
//           productVariantId: item.productVariantId,
//           quantity: item.quantity,
//           name: item.variant.product.name,
//           price: parseFloat(item.variant.price),
//           image: item.variant.images[0]?.url,
//           size: item.variant.size.name,
//           color: item.variant.color.name,
//         })),
//         total: cart.total,
//         loading: false,
//       });
//     } else {
//       set({ items: [], total: 0, loading: false });
//     }
//   } catch (error) {
//     set({ error: 'Failed to fetch cart', loading: false });
//   }
// },
//       addItem: async (productVariantId, quantity = 1) => {
//         const currentItems = get().items;
//         const existingItem = currentItems.find(item => item.productVariantId === productVariantId);

//         // Optimistic update
//         if (existingItem) {
//           set({
//             items: currentItems.map(item =>
//               item.productVariantId === productVariantId
//                 ? { ...item, quantity: item.quantity + quantity }
//                 : item
//             ),
//             total: get().total + (existingItem.price * quantity),
//             loading: true,
//             error: null,
//           });
//         } else {
//           // For new items, we need to fetch product details - simplified for now
//           set({ loading: true, error: null });
//         }

//         try {
//           const res = await cartActions.addCartItem(productVariantId, quantity);
//           if (res.success) {
//             await get().fetchCart();
//           } else {
//             // Revert optimistic update on failure
//             set({
//               items: currentItems,
//               total: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
//               error: res.error || 'Failed to add item',
//               loading: false,
//             });
//           }
//         } catch (error) {
//           // Revert optimistic update on error
//           set({
//             items: currentItems,
//             total: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
//             error: 'Failed to add item',
//             loading: false,
//           });
//         }
//       },
//       removeItem: async (id) => {
//         const currentItems = get().items;
//         const itemToRemove = currentItems.find(item => item.id === id);

//         if (itemToRemove) {
//           // Optimistic update
//           set({
//             items: currentItems.filter(item => item.id !== id),
//             total: get().total - (itemToRemove.price * itemToRemove.quantity),
//             loading: true,
//             error: null,
//           });
//         }

//         try {
//           const res = await cartActions.removeCartItem(id);
//           if (res.success) {
//             await get().fetchCart();
//           } else {
//             // Revert optimistic update on failure
//             set({
//               items: currentItems,
//               total: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
//               error: res.error || 'Failed to remove item',
//               loading: false,
//             });
//           }
//         } catch (error) {
//           // Revert optimistic update on error
//           set({
//             items: currentItems,
//             total: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
//             error: 'Failed to remove item',
//             loading: false,
//           });
//         }
//       },
//       updateQuantity: async (id, quantity) => {
//         const currentItems = get().items;
//         const currentItem = currentItems.find(item => item.id === id);

//         if (currentItem) {
//           // Optimistic update
//           set({
//             items: currentItems.map(item =>
//               item.id === id ? { ...item, quantity } : item
//             ),
//             total: get().total + (currentItem.price * (quantity - currentItem.quantity)),
//             loading: true,
//             error: null,
//           });
//         }

//         try {
//           const res = await cartActions.updateCartItem(id, quantity);
//           if (res.success) {
//             await get().fetchCart();
//           } else {
//             // Revert optimistic update on failure
//             set({
//               items: currentItems,
//               total: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
//               error: res.error || 'Failed to update quantity',
//               loading: false,
//             });
//           }
//         } catch (error) {
//           // Revert optimistic update on error
//           set({
//             items: currentItems,
//             total: currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
//             error: 'Failed to update quantity',
//             loading: false,
//           });
//         }
//       },
//       clearCart: async () => {
//         set({ loading: true, error: null });
//         try {
//           const res = await cartActions.clearCart();
//           if (res.success) {
//             await get().fetchCart();
//           } else {
//             set({ error: res.error || 'Failed to clear cart', loading: false });
//           }
//         } catch (error) {
//           set({ error: 'Failed to clear cart', loading: false });
//         }
//       },
//       getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
//     }),
//     {
//       name: 'cart-storage',
//     }
//   )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as cartActions from "@/lib/actions/cart";

// -------------------- DB TYPES --------------------
interface DBVariant {
  id: string;
  price: string; // price usually comes back as string from DB
  product?: { name?: string };
  images?: { url: string }[];
  size?: { name: string };
  color?: { name: string };
}

interface DBCartItem {
  id: string;
  productVariantId: string;
  quantity: number;
  variant?: DBVariant;
}

interface DBCart {
  id: string;
  items: DBCartItem[];
}

// -------------------- STORE TYPES --------------------
interface CartItem {
  id: string;
  productVariantId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productVariantId: string, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
}

// -------------------- STORE --------------------
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      loading: false,
      error: null,

      // ---------------- FETCH CART ----------------
      fetchCart: async () => {
        set({ loading: true, error: null });
        try {
          const cart: DBCart | null = await cartActions.getCart();

          if (cart) {
            set({
              items: cart.items.map((item) => ({
                id: item.id,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                name: item.variant?.product?.name ?? "Unknown Product",
                price: parseFloat(item.variant?.price ?? "0"),
                image: item.variant?.images?.[0]?.url,
                size: item.variant?.size?.name,
                color: item.variant?.color?.name,
              })),
              total: cart.items.reduce(
                (sum, item) =>
                  sum + parseFloat(item.variant?.price ?? "0") * item.quantity,
                0
              ),
              loading: false,
            });
          } else {
            set({ items: [], total: 0, loading: false });
          }
        } catch {
          set({ error: "Failed to fetch cart", loading: false });
        }
      },

      // ---------------- ADD ITEM ----------------
      addItem: async (productVariantId, quantity = 1) => {
        const currentItems = get().items;
        set({ loading: true, error: null });

        try {
          const res = await cartActions.addCartItem(productVariantId, quantity);
          if (res.success) {
            await get().fetchCart();
          } else {
            set({
              error: res.error || "Failed to add item",
              loading: false,
              items: currentItems,
              total: currentItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
            });
          }
        } catch {
          set({
            error: "Failed to add item",
            loading: false,
            items: currentItems,
            total: currentItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
          });
        }
      },

      // ---------------- REMOVE ITEM ----------------
      removeItem: async (id) => {
        const currentItems = get().items;
        set({ loading: true, error: null });

        try {
          const res = await cartActions.removeCartItem(id);
          if (res.success) {
            await get().fetchCart();
          } else {
            set({
              error: res.error || "Failed to remove item",
              loading: false,
              items: currentItems,
              total: currentItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
            });
          }
        } catch {
          set({
            error: "Failed to remove item",
            loading: false,
            items: currentItems,
            total: currentItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
          });
        }
      },

      // ---------------- UPDATE QUANTITY ----------------
      updateQuantity: async (id, quantity) => {
        const currentItems = get().items;
        set({ loading: true, error: null });

        try {
          const res = await cartActions.updateCartItem(id, quantity);
          if (res.success) {
            await get().fetchCart();
          } else {
            set({
              error: res.error || "Failed to update quantity",
              loading: false,
              items: currentItems,
              total: currentItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
            });
          }
        } catch {
          set({
            error: "Failed to update quantity",
            loading: false,
            items: currentItems,
            total: currentItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
          });
        }
      },

      // ---------------- CLEAR CART ----------------
      clearCart: async () => {
        set({ loading: true, error: null });
        try {
          const res = await cartActions.clearCart();
          if (res.success) {
            await get().fetchCart();
          } else {
            set({ error: res.error || "Failed to clear cart", loading: false });
          }
        } catch {
          set({ error: "Failed to clear cart", loading: false });
        }
      },

      // ---------------- ITEM COUNT ----------------
      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
