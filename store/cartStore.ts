import { create } from "zustand";
import { persist } from "zustand/middleware"; // ✅ Persiste le panier dans localStorage
import { Product } from "@/data/products";

// Type d'un article dans le panier
type CartItem = Product & { quantity: number };

interface CartStore {
  items: CartItem[];
  totalPrice: number;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,

      // 1. AJOUTER AU PANIER
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          const updatedItems = existing
            ? state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              )
            : [...state.items, { ...product, quantity: 1 }];

          const total = updatedItems.reduce(
            (acc, i) => acc + i.price * i.quantity,
            0
          );

          return { items: updatedItems, totalPrice: total };
        }),

      // 2. SUPPRIMER UN ARTICLE
      removeItem: (productId) =>
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== productId);
          const total = updatedItems.reduce(
            (acc, i) => acc + i.price * i.quantity,
            0
          );
          return { items: updatedItems, totalPrice: total };
        }),

      // 3. MODIFIER LA QUANTITÉ
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) return state;
          const updatedItems = state.items.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          );
          const total = updatedItems.reduce(
            (acc, i) => acc + i.price * i.quantity,
            0
          );
          return { items: updatedItems, totalPrice: total };
        }),

      // 4. VIDER LE PANIER
      clear: () => set({ items: [], totalPrice: 0 }),
    }),
    { name: "neon-strike-cart" } // ✅ Clé localStorage — panier persisté entre sessions
  )
);