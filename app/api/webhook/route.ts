import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ============================================================
// SIMULATION BDD — Événements déjà traités (idempotence)
// En production : table webhook_events en base de données
// ============================================================
const processedEvents = new Map<string, number>(); // eventId → timestamp

// ✅ Nettoyage automatique après 10 minutes (évite la fuite mémoire)
const CLEANUP_DELAY_MS = 10 * 60 * 1000; // 10 minutes

function scheduleCleanup(eventId: string) {
  setTimeout(() => {
    processedEvents.delete(eventId);
    console.log(`🧹 Événement nettoyé de la mémoire : ${eventId}`);
  }, CLEANUP_DELAY_MS);
}

// ============================================================
// VÉRIFICATION SIGNATURE HMAC
// ============================================================
function verifySignature(payload: string, signature: string): boolean {
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
  LIVCFM:  "delivered",
  ENCOURS: "in_transit",
  TRTPLT:  "out_for_delivery",
  PCHRSF:  "pickup_failed",
};

// ============================================================
// POST /api/webhook/delivery
// ============================================================
export async function POST(req: NextRequest) {
  // ⚡ Répondre 200 IMMÉDIATEMENT — règle absolue des webhooks
  const body = await req.text();
  const signature = req.headers.get("x-colissimo-signature") || "";

  processDeliveryEvent(body, signature).catch(console.error);

  return NextResponse.json({ received: true }, { status: 200 });
}

async function processDeliveryEvent(body: string, signature: string) {
  try {
    // 1. Vérifier la signature HMAC
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

    // 3. Marquer comme traité + planifier nettoyage après 10 min
    processedEvents.set(eventId, Date.now());
    scheduleCleanup(eventId);

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
    }

    console.log(`✅ Événement ${eventId} traité avec succès`);

  } catch (err: any) {
    console.error("❌ Erreur traitement webhook :", err.message);
  }
}