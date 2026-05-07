"use client";

// ✅ CartContext mis à jour pour utiliser Zustand
// Garde exactement la même interface (useCart, addToCart, removeFromCart...)
// pour que tout le code existant continue de fonctionner sans modification

import React, { createContext, useContext } from "react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/data/products";

type CartItem = Product & { quantity: number };

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ✅ On utilise le store Zustand à la place du useState
  const { items, totalPrice, addItem, removeItem, updateQuantity, clear } =
    useCartStore();

  return (
    <CartContext.Provider
      value={{
        cart: items,
        addToCart: addItem,
        removeFromCart: removeItem,
        updateQuantity,
        clearCart: clear,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personnalisé — identique à avant
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}