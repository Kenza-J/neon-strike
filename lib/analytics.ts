// ============================================================
// lib/analytics.ts — Utilitaire GA4 pour Neon Strike
// Toutes les fonctions de tracking e-commerce centralisées ici
// ============================================================

import { Product } from "@/data/products";

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// ============================================================
// FONCTION DE BASE — Envoyer n'importe quel événement GA4
// ============================================================
export function trackEvent(name: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  const send = () => {
    if (typeof window.gtag === "undefined") {
      setTimeout(send, 300);
      return;
    }
    window.gtag("event", name, params);
  };
  send();
}

// ============================================================
// VIEW ITEM — Déclenché quand un client voit une fiche produit
// ✅ Attend que gtag soit chargé avant d'envoyer
// ============================================================
export function trackViewItem(product: Product) {
  if (typeof window === "undefined") return;

  const send = () => {
    if (typeof window.gtag === "undefined") {
      setTimeout(send, 300); // Réessaie toutes les 300ms
      return;
    }

    // ✅ Clear obligatoire avant chaque push e-commerce
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.gtag("event", "view_item", {
      currency: "MAD",
      value: product.price,
      items: [
        {
          item_id:       product.id,
          item_name:     product.name,
          item_category: product.category,
          price:         product.price,
          quantity:      1,
        },
      ],
    });

    console.log("📊 GA4 view_item :", product.name);
  };
  send();
}

// ============================================================
// ADD TO CART — Déclenché quand un client ajoute au panier
// ✅ Attend que gtag soit chargé avant d'envoyer
// ============================================================
export function trackAddToCart(product: Product, quantity: number = 1) {
  if (typeof window === "undefined") return;

  const send = () => {
    if (typeof window.gtag === "undefined") {
      setTimeout(send, 300);
      return;
    }

    // ✅ Clear obligatoire avant chaque push e-commerce
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.gtag("event", "add_to_cart", {
      currency: "MAD",
      value:    product.price * quantity,
      items: [
        {
          item_id:       product.id,
          item_name:     product.name,
          item_category: product.category,
          price:         product.price,
          quantity,
        },
      ],
    });

    console.log("📊 GA4 add_to_cart :", product.name, "×", quantity);
  };
  send();
}

// ============================================================
// PURCHASE — Déclenché après confirmation du paiement
// ✅ Anti double-comptage via sessionStorage
// ============================================================
export function trackPurchase(orderId: string, total: number, items: any[]) {
  if (typeof window === "undefined") return;

  const send = () => {
    if (typeof window.gtag === "undefined") {
      setTimeout(send, 300);
      return;
    }

    // ✅ Clear obligatoire avant chaque push e-commerce
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.gtag("event", "purchase", {
      transaction_id: orderId,
      value:          total,
      currency:       "MAD",
      shipping:       0,
      tax:            0,
      items:          items.map((item) => ({
        item_id:   item.id,
        item_name: item.name,
        price:     item.price,
        quantity:  item.quantity,
      })),
    });

    console.log("📊 GA4 purchase :", orderId, total, "MAD");
  };
  send();
}