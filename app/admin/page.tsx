"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition mb-8"
      >
        <ArrowLeft size={16} /> Retour
      </Link>

      <h1 className="text-3xl font-black uppercase mb-2">
        🛒 Admin — Commandes
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Commandes enregistrées via webhook Stripe
      </p>

      {loading && (
        <p className="text-gray-500">Chargement...</p>
      )}

      {!loading && orders.length === 0 && (
        <div className="p-6 bg-[#1a1a1a] rounded-xl border border-white/10 text-gray-400 flex items-center gap-3">
          <ShoppingBag size={20} />
          Aucune commande pour l'instant. Faites un paiement test !
        </div>
      )}

      <div className="space-y-4">
        {orders.map((o: any) => (
          <div
            key={o.id}
            className="p-6 bg-[#1a1a1a] rounded-xl border border-white/10 space-y-2"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-purple-400">{o.id}</span>
              <span className="text-green-400 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full">
                ✅ {o.status}
              </span>
            </div>
            <p className="text-sm text-gray-300">👤 <span className="text-white">{o.customer_name}</span></p>
            <p className="text-sm text-gray-300">📞 <span className="text-white">{o.phone}</span></p>
            <p className="text-sm text-gray-300">💰 <span className="text-white font-bold">{o.amount} MAD</span></p>
            <p className="text-xs text-gray-500 mt-2">🧾 {o.payment_intent}</p>
          </div>
        ))}
      </div>

    </div>
  );
}