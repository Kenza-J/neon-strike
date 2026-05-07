import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount, customer_name, phone } = await req.json();

    // 🛡️ Validation du montant
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    // 💳 Création du PaymentIntent avec métadonnées client
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe travaille en centimes
      currency: "mad",
      automatic_payment_methods: { enabled: true },

      // 🔥 Métadonnées : niveau e-commerce réel
      metadata: {
        customer_name: customer_name || "Inconnu",
        phone: phone || "Inconnu",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error("Erreur PaymentIntent :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}