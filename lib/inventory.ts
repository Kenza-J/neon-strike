// ============================================================
// SIMULATION REDIS — Stock en mémoire serveur
// En production : remplacer par redis.get() / redis.set()
// ============================================================

// Stock initial des produits (simulé)
const stockCache: Record<string, number> = {
  "keyboard-rgb":    10,
  "gaming-mouse":    15,
  "mousepad-xl":     20,
  "streaming-mic":    8,
  "monitor-arm":      5,
  "gaming-headset":  12,
  "earbuds-pro":      7,
  "soundbar-neon":    4,
  "studio-headphones": 3,
  "neon-console-x":   6,
  "retro-strike-box": 9,
  "neon-vr-headset":  2,
};

// ============================================================
// LIRE LE STOCK — Redis en premier (0.1ms), BDD ensuite
// ============================================================
export async function getStock(sku: string): Promise<number> {
  // Simulation cache Redis
  if (sku in stockCache) {
    return stockCache[sku];
  }
  // Cache miss → retourne 0 (produit inconnu)
  return 0;
}

// ============================================================
// RÉSERVER DU STOCK — Atomique (évite les race conditions)
// En production : script Lua Redis pour garantir l'atomicité
// ============================================================
export async function reserveStock(sku: string, quantity: number): Promise<boolean> {
  const current = await getStock(sku);

  // Vérification stock suffisant
  if (current < quantity) {
    throw new Error(`Stock insuffisant pour ${sku} — disponible: ${current}, demandé: ${quantity}`);
  }

  // Décrémentation atomique (simulée)
  stockCache[sku] = current - quantity;

  // Alerte stock bas (seuil = 3 unités)
  const remaining = stockCache[sku];
  if (remaining <= 3) {
    console.warn(`⚠️ ALERTE stock bas : ${sku} — ${remaining} unité(s) restante(s)`);
    // TODO production : envoyer email/Slack à l'équipe
  }

  console.log(`✅ Stock réservé : ${sku} — ${current} → ${remaining}`);
  return true;
}

// ============================================================
// LIBÉRER LE STOCK — En cas d'annulation commande
// ============================================================
export async function releaseStock(sku: string, quantity: number): Promise<void> {
  const current = await getStock(sku);
  stockCache[sku] = current + quantity;
  console.log(`🔄 Stock libéré : ${sku} — ${current} → ${stockCache[sku]}`);
}

// ============================================================
// LISTER TOUT LE STOCK — Pour la page admin
// ============================================================
export async function getAllStock(): Promise<Record<string, number>> {
  return { ...stockCache };
}