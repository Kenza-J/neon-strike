import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ============================================================
// VALIDATION ZOD — Structure des données d'entrée
// ============================================================
const QuoteSchema = z.object({
  sender: z.object({
    postalCode: z.string(),
    countryCode: z.string().length(2),
  }),
  recipient: z.object({
    postalCode: z.string(),
    countryCode: z.string().length(2),
  }),
  parcel: z.object({
    weightKg: z.number().positive().max(70),
    lengthCm: z.number().positive(),
    widthCm:  z.number().positive(),
    heightCm: z.number().positive(),
  }),
});

// ✅ Pro API — pas de cache sur les tarifs (toujours frais)
export const revalidate = 0;

// ============================================================
// POIDS VOLUMÉTRIQUE — Facturation réelle des transporteurs
// Formule : (L x l x h) / 5000
// ============================================================
function getVolumetricWeight(parcel: {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}) {
  return (parcel.lengthCm * parcel.widthCm * parcel.heightCm) / 5000;
}

// Poids facturable = max(poids réel, poids volumétrique)
function getBillableWeight(parcel: {
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}) {
  return Math.max(parcel.weightKg, getVolumetricWeight(parcel));
}

// ============================================================
// SIMULATION API COLISSIMO — Tarifs réalistes
// ============================================================
function getSimulatedRates(billableWeight: number) {
  const base = billableWeight * 2.5;

  return [
    {
      carrier: "colissimo",
      service: "Colissimo Standard",
      priceTTC: parseFloat((base + 5.9).toFixed(2)),
      estimatedDays: 5,
      deliveryDate: getDeliveryDate(5),
      currency: "MAD",
    },
    {
      carrier: "colissimo",
      service: "Colissimo Express",
      priceTTC: parseFloat((base + 12.9).toFixed(2)),
      estimatedDays: 2,
      deliveryDate: getDeliveryDate(2),
      currency: "MAD",
    },
    {
      carrier: "ups",
      service: "UPS Standard",
      priceTTC: parseFloat((base + 8.5).toFixed(2)),
      estimatedDays: 3,
      deliveryDate: getDeliveryDate(3),
      currency: "MAD",
    },
  ].sort((a, b) => a.priceTTC - b.priceTTC);
}

function getDeliveryDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

// ============================================================
// POST /api/shipping/rates
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validation Zod
    const result = QuoteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.issues },
        { status: 400 }
      );
    }

    const { parcel } = result.data;

    // 2. Calcul des poids
    const volumetricWeight = getVolumetricWeight(parcel);
    const billableWeight   = getBillableWeight(parcel);

    // 3. Tarifs simulés Colissimo / UPS
    const rates = getSimulatedRates(billableWeight);

    // 4. Réponse normalisée
    return NextResponse.json({
      rates,
      meta: {
        realWeightKg:       parcel.weightKg,
        volumetricWeightKg: parseFloat(volumetricWeight.toFixed(3)),
        billableWeightKg:   parseFloat(billableWeight.toFixed(3)),
        cheapest:           rates[0],
        fastest:            [...rates].sort((a, b) => a.estimatedDays - b.estimatedDays)[0],
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Service de livraison indisponible" },
      { status: 500 }
    );
  }
}