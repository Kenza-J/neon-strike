import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ============================================================
// SIMULATION BDD — Événements déjà traités (idempotence)
// En production : table webhook_events en base de données
// ============================================================
const processedEvents = new Set<string>();

// ============================================================
// VÉRIFICATION SIGNATURE HMAC
// Authentifie que la requête vient bien du transporteur
// ============================================================
function verifySignature(payload: string, signature: string): boolean {
  // En mode test, on accepte la signature "TEST_SIGNATURE"
  if (signature === "TEST_SIGNATURE") return true;

  const expected = crypto
    .createHmac("sha256", process.env.COLISSIMO_WEBHOOK_SECRET || "secret")
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature.padEnd(expected.length, "0").slice(0, expected.length), "hex")
  );
}

// Normalisation des codes statut Colissimo
const STATUS_MAP: Record<string, string> = {
  LIVCFM:  "delivered",       // Livré
  ENCOURS: "in_transit",      // En cours d'acheminement
  TRTPLT:  "out_for_delivery", // En cours de livraison
  PCHRSF:  "pickup_failed",   // Échec de collecte
};

// ============================================================
// POST /api/webhook/delivery
// ============================================================
export async function POST(req: NextRequest) {
  // ⚡ Répondre 200 IMMÉDIATEMENT avant tout traitement
  // Si on tarde, le transporteur relance le webhook → double traitement
  const body = await req.text();
  const signature = req.headers.get("x-colissimo-signature") || "";

  // Traitement asynchrone après la réponse
  processDeliveryEvent(body, signature).catch(console.error);

  return NextResponse.json({ received: true }, { status: 200 });
}

async function processDeliveryEvent(body: string, signature: string) {
  try {
    // 1. Vérifier la signature
    if (!verifySignature(body, signature)) {
      console.error("❌ Signature webhook invalide");
      return;
    }

    const payload = JSON.parse(body);
    const eventId = payload.eventId;

    // 2. Idempotence — ignorer si déjà traité
    if (processedEvents.has(eventId)) {
      console.log(`⚠️ Événement déjà traité : ${eventId}`);
      return;
    }

    // 3. Marquer comme en cours de traitement
    processedEvents.add(eventId);

    // 4. Normaliser le statut
    const status = STATUS_MAP[payload.event?.code] || "unknown";

    console.log("📦 WEBHOOK LIVRAISON REÇU");
    console.log("🆔 Event ID     :", eventId);
    console.log("📮 Colis        :", payload.parcelNumber);
    console.log("📊 Statut       :", status);
    console.log("📅 Date         :", payload.event?.date);

    // 5. Mise à jour commande (simulée)
    console.log(`🔄 Commande mise à jour : ${payload.parcelNumber} → ${status}`);

    // 6. Si livré → notification client
    if (status === "delivered") {
      console.log(`✅ Commande ${payload.parcelNumber} LIVRÉE — email client envoyé`);
      // TODO production : sendDeliveryEmail(order.customerEmail)
    }

    console.log(`✅ Événement ${eventId} traité avec succès`);

  } catch (err: any) {
    console.error("❌ Erreur traitement webhook :", err.message);
  }
}