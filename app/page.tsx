"use client";
import Hero from "@/components/Hero";
import Link from "next/link";
import { Zap, Shield, Target, Cpu } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* 1. HERO SECTION (Déjà personnalisée avec ton image) */}
      <Hero />

      {/* 2. SECTION FEATURES ASYMÉTRIQUE (Casse la ressemblance) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bloc Principal Large */}
          <div className="md:col-span-8 bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 p-10 rounded-3xl backdrop-blur-sm group hover:border-purple-500/50 transition-all">
            <Cpu className="text-purple-500 mb-6" size={40} />
            <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">
              Architecture <span className="text-purple-500">Vanguard</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Nos composants intègrent les dernières puces de traitement pour une latence proche de zéro. Conçu pour l'élite.
            </p>
          </div>

          {/* Petit Bloc Latéral */}
          <div className="md:col-span-4 bg-[#0a0a0a] border border-white/5 p-10 rounded-3xl flex flex-col justify-end group hover:bg-purple-600/5 transition-all">
            <Target className="text-cyan-400 mb-4" size={32} />
            <h3 className="text-xl font-bold uppercase italic">Précision chirurgicale</h3>
          </div>

          {/* Deux Blocs Égaux en bas */}
          <div className="md:col-span-6 bg-[#0a0a0a] border border-white/5 p-10 rounded-3xl group hover:border-cyan-500/30 transition-all">
            <Zap className="text-yellow-400 mb-4" size={32} />
            <h3 className="text-2xl font-black uppercase italic mb-2 text-white">Vitesse Éclair</h3>
            <p className="text-gray-500 text-sm">Temps de réponse de 0.1ms pour ne jamais rater un clic.</p>
          </div>

          <div className="md:col-span-6 bg-purple-600 p-10 rounded-3xl text-black flex items-center justify-between group cursor-pointer hover:bg-purple-500 transition-all">
            <div>
              <h3 className="text-3xl font-black uppercase italic leading-none">Garantie PRO</h3>
              <p className="font-bold opacity-80 mt-2 text-sm uppercase">Protection 3 ans incluse</p>
            </div>
            <Shield size={60} className="opacity-20 group-hover:scale-110 transition-transform" />
          </div>

        </div>
      </section>

      {/* 3. SECTION CALL-TO-ACTION (Design "Split") */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">
              PRÊT À <br /> <span className="text-purple-600">DOMINER ?</span>
            </h2>
            <p className="text-gray-400 font-medium">Rejoignez la communauté NEON STRIKE aujourd'hui.</p>
          </div>
          <Link href="/products" className="btn-neon text-2xl px-16 py-8">
            VOIR TOUT LE SETUP
          </Link>
        </div>
      </section>
    </main>
  );
}