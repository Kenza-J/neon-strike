"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ShieldCheck, CreditCard, ArrowLeft, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const stripeElementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "monospace",
      "::placeholder": { color: "#555555" },
    },
    invalid: { color: "#ff4444" },
  },
};

function CheckoutForm({
  totalPrice,
  clearCart,
  customerName,
  phone,
}: {
  totalPrice: number;
  clearCart: () => void;
  customerName: string;
  phone: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage("");

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalPrice,
        customer_name: customerName,
        phone: phone,
      }),
    });

    const data = await res.json();

    if (!data.clientSecret) {
      setErrorMessage("Erreur lors de la création du paiement.");
      setLoading(false);
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: { card: cardNumber },
    });

    if (result.error) {
      setErrorMessage(result.error.message || "Erreur de paiement.");
    } else {
      clearCart();
      const paymentIntentId = result.paymentIntent?.id || "";
      window.location.href = `/success?payment_intent=${paymentIntentId}`;
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Numéro de carte</label>
        <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
          <CardNumberElement options={stripeElementStyle} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Date d'expiration</label>
          <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
            <CardExpiryElement options={stripeElementStyle} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">CVC</label>
          <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
            <CardCvcElement options={stripeElementStyle} />
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
          ⚠️ {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
      >
        <Lock size={16} />
        {loading ? "Traitement en cours..." : `Payer ${totalPrice} MAD`}
      </button>
    </form>
  );
}

export default function CommanderPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Protection de la route — redirige vers login si non connecté
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Casablanca");

  const isFormValid = name !== "" && phone !== "" && address !== "";

  // Afficher loading pendant la vérification de session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p className="mb-4 text-gray-500">Votre panier est vide pour passer une commande.</p>
        <Link href="/products" className="text-purple-500 font-bold">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition mb-10">
          <ArrowLeft size={16} /> Retour au panier
        </Link>

        <h1 className="text-4xl font-black mb-10">Checkout</h1>

        {/* ✅ Message de bienvenue si connecté */}
        {session && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
            ✅ Connecté en tant que <strong>{session.user?.name}</strong>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-16">

          <div className="space-y-4">
            <h2 className="font-bold text-lg mb-2">Informations de livraison</h2>

            <input
              className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              placeholder="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              placeholder="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <select
              className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option>Casablanca</option>
              <option>Rabat</option>
              <option>Marrakech</option>
            </select>

            <div className="flex items-center gap-3 text-purple-500 text-sm">
              <CreditCard size={16} />
              Paiement 100% sécurisé via Stripe
            </div>
          </div>

          <div className="bg-[#0f0f10] border border-white/5 p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="font-bold text-lg mb-4">Résumé de la commande</h2>
              {cart.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{item.price * item.quantity} MAD</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between font-bold text-white">
                <span>Total</span>
                <span>{totalPrice} MAD</span>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-4">Paiement</h2>
              <Elements stripe={stripePromise}>
                {isFormValid ? (
                  <CheckoutForm
                    totalPrice={totalPrice}
                    clearCart={clearCart}
                    customerName={name}
                    phone={phone}
                  />
                ) : (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
                    ⚠️ Remplis d'abord les informations de livraison
                  </div>
                )}
              </Elements>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <ShieldCheck size={14} />
              Vos données sont chiffrées et sécurisées
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}