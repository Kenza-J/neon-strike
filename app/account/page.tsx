 "use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { User, ShoppingBag, LogOut, ArrowLeft } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Protection de la route — redirige si non connecté
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">

        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition mb-10">
          <ArrowLeft size={16} /> Retour
        </Link>

        <h1 className="text-4xl font-black uppercase mb-10">Mon Compte</h1>

        {/* Infos utilisateur */}
        <div className="bg-[#0f0f10] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center">
              {session.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={28} className="text-purple-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black">{session.user?.name || "Utilisateur"}</h2>
              <p className="text-gray-400 text-sm">{session.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black/50 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Membre depuis</p>
              <p className="font-bold">2026</p>
            </div>
            <div className="p-4 bg-black/50 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Statut</p>
              <p className="font-bold text-green-400">✅ Actif</p>
            </div>
          </div>
        </div>

        {/* Historique commandes */}
        <div className="bg-[#0f0f10] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag size={20} className="text-purple-400" />
            <h2 className="text-lg font-black uppercase">Mes Commandes</h2>
          </div>

          <div className="text-center py-8 text-gray-500">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucune commande pour l'instant</p>
            <Link href="/products" className="text-purple-400 hover:text-purple-300 font-bold text-sm mt-2 inline-block">
              Explorer la boutique →
            </Link>
          </div>
        </div>

        {/* Déconnexion */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition font-bold"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>

      </div>
    </div>
  );
}
