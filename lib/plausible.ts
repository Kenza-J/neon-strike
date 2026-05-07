// ============================================================
// lib/plausible.ts — Plausible Analytics (privacy-first)
// Sans cookies, RGPD natif, script 1KB vs 28KB pour GA4
// ============================================================

// ============================================================
// TRACKER D'ÉVÉNEMENTS PERSONNALISÉS Plausible
// ============================================================
export function trackPlausible(
  name: string,
  props?: Record<string, string | number>
) {
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible(name, { props });
  }
}

// ============================================================
// ÉVÉNEMENTS PRÉDÉFINIS — Cohérence dans tout le projet
// ============================================================

// Quand un client voit un produit
export function plausibleViewItem(productName: string, category: string) {
  trackPlausible("View Item", { product: productName, category });
}

// Quand un client ajoute au panier
export function plausibleAddToCart(productName: string, price: number) {
  trackPlausible("Add to Cart", { product: productName, value: price });
}

// Quand un client finalise son achat
export function plausiblePurchase(total: number) {
  trackPlausible("Purchase", { value: total });
}
