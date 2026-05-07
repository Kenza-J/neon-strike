import { NextRequest } from "next/server";
import { getAllStock } from "@/lib/inventory";

// ============================================================
// GET /api/stock/stream — SSE (Server-Sent Events)
// Diffuse les mises à jour du stock en temps réel au dashboard admin
// ============================================================

// Liste des clients connectés au stream
const clients = new Set<ReadableStreamDefaultController>();

// ✅ Fonction appelée depuis inventory.ts après chaque reserveStock/releaseStock
export function notifyStockUpdate(sku: string, newStock: number) {
  const data = JSON.stringify({ sku, stock: newStock, updatedAt: new Date().toISOString() });
  clients.forEach((client) => {
    try {
      client.enqueue(`data: ${data}\n\n`);
    } catch {
      clients.delete(client);
    }
  });
}

export async function GET(req: NextRequest) {
  // Stock initial à l'ouverture de la connexion
  const initialStock = await getAllStock();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Envoyer le stock complet au client qui vient de se connecter
      controller.enqueue(
        `data: ${JSON.stringify({ type: "init", stock: initialStock })}\n\n`
      );

      // 2. Enregistrer ce client pour les futures mises à jour
      clients.add(controller);
      console.log(`📡 Client SSE connecté — total: ${clients.size}`);

      // 3. Heartbeat toutes les 30s pour garder la connexion ouverte
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(`: heartbeat\n\n`);
        } catch {
          clearInterval(heartbeat);
          clients.delete(controller);
        }
      }, 30000);

      // 4. Nettoyage à la déconnexion
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        clients.delete(controller);
        console.log(`📡 Client SSE déconnecté — total: ${clients.size}`);
      });
    },
  });

  // Headers SSE obligatoires
  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}