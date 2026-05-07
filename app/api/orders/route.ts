import { NextRequest, NextResponse } from "next/server";
import { getStock, reserveStock, releaseStock } from "@/lib/inventory";

// ============================================================
// POST /api/orders
// Crée une commande en vérifiant et réservant le stock
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    // 1. Vérifier le stock de chaque article AVANT de créer la commande
    for (const item of items) {
      const available = await getStock(item.id);
      if (available < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuffisant pour "${item.name}" — disponible: ${available}, demandé: ${item.quantity}`,
          },
          { status: 409 } // 409 Conflict
        );
      }
    }

    // 2. Réserver le stock de façon atomique pour chaque article
    const reserved: { id: string; quantity: number }[] = [];

    try {
      for (const item of items) {
        await reserveStock(item.id, item.quantity);
        reserved.push({ id: item.id, quantity: item.quantity });
        console.log(`✅ Stock réservé : ${item.id} × ${item.quantity}`);
      }
    } catch (stockError: any) {
      // 3. Rollback — libérer le stock déjà réservé en cas d'erreur
      console.error("❌ Erreur réservation stock, rollback en cours...");
      for (const r of reserved) {
        await releaseStock(r.id, r.quantity);
        console.log(`🔄 Stock libéré (rollback) : ${r.id} × ${r.quantity}`);
      }
      return NextResponse.json(
        { error: stockError.message },
        { status: 409 }
      );
    }

    // 4. Commande créée avec succès
    const order = {
      orderId: `ORD-${Date.now()}`,
      status: "confirmed",
      items,
      createdAt: new Date().toISOString(),
    };

    console.log("📦 COMMANDE CRÉÉE :", order);

    return NextResponse.json({ success: true, order });

  } catch (error: any) {
    console.error("❌ Erreur création commande :", error.message);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}

// ============================================================
// GET /api/orders — Liste des commandes (simulation)
// ============================================================
export async function GET() {
  // Simulation — en production : récupérer depuis la BDD
  return NextResponse.json({
    message: "Liste des commandes — connecter une BDD en production",
    orders: [],
  });
}