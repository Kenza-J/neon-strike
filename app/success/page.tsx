"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight, Share2 } from "lucide-react";
import { Suspense } from "react";

/* =========================
   CONTENU DE LA PAGE
========================= */
function SuccessContent() {
  const searchParams = useSearchParams();

  // Récupère le payment_intent depuis l'URL (Stripe le passe automatiquement)
  const paymentIntentId = searchParams.get("payment_intent");
  const shortId = paymentIntentId
    ? "NS-" + paymentIntentId.slice(-8).toUpperCase()
    : "NS-2026-99";

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">

      {/* CÔTÉ GAUCHE : VISUEL & STATUT */}
      <div className="md:w-1/2 relative flex flex-col items-center justify-center p-12 border-b md:border-b-0 md:border-r border-white/5 bg-gradient-to-br from-purple-900/10 to-transparent">
        <div className="absolute w-64 h-64 bg-purple-600/20 blur-[120px] rounded-full" />

        <div className="relative z-10 text-center">
          <div className="inline-flex p-4 rounded-full bg-purple-600/20 border border-purple-500/50 mb-8 animate-bounce">
            <CheckCircle size={60} className="text-purple-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
            COMMANDE <br /> <span className="text-purple-600">DÉPLOYÉE</span>
          </h1>

          {/* ✅ ID Transaction réel Stripe */}
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
            ID de Transaction : #{shortId}
          </p>

          {/* Badge paiement sécurisé */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-bold">
            ✅ Paiement confirmé par Stripe
          </div>
        </div>
      </div>

      {/* CÔTÉ DROIT : ACTIONS */}
      <div className="md:w-1/2 flex flex-col justify-center p-12 md:p-24 space-y-12">

        <div className="space-y-6">
          <div className="flex items-start gap-6 group">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition-colors">
              <Package className="text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic">Préparation Prioritaire</h3>
              <p className="text-gray-400">
                Votre équipement est en cours de test de performance avant expédition.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 group">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition-colors">
              <Share2 className="text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic">Rejoignez l'Élite</h3>
              <p className="text-gray-400">
                Partagez votre nouveau setup avec le tag #NeonStrike.
              </p>
            </div>
          </div>
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="flex flex-col gap-4 pt-8">
          <Link
            href="/"
            className="btn-neon text-center py-6 flex items-center justify-center gap-2 group"
          >
            Retourner au Quartier Général
            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

      </div>
    </main>
  );
}

/* =========================
   PAGE EXPORT (avec Suspense obligatoire pour useSearchParams)
========================= */
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}