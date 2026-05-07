"use client";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black">
      
      {/* --- AJOUT DE L'IMAGE DE FOND --- */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/hero-bg.jpg')", // Assure-toi qu'elle est dans /public
        }}
      >
        {/* Overlays pour la lisibilité et le style Neon Strike */}
        <div className="absolute inset-0 bg-black/60 z-10" /> 
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black z-10" />
      </div>
      {/* ------------------------------- */}

      {/* Decorative Grid (Optionnel pour le look Tech) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-10" />

      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        {/* Badge Moderne */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest mb-8">
          <Zap size={14} fill="currentColor" /> Performance sans compromis
        </div>

        {/* Titre Imposant (Comme VanguardTech mais version Neon) */}
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none italic uppercase">
          NEON <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">STRIKE</span>
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Équipez votre setup avec la technologie de demain. Précision ultime, 
          vitesse éclair et design néon pour les joueurs exigeants.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/products" 
            className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 italic uppercase"
          >
            Explorer la Boutique
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/category/accessoires" // Corrigé pour correspondre à tes dossiers
            className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold transition backdrop-blur-sm"
          >
            Nouveautés
          </Link>
        </div>
      </div>

      {/* Scroll Indicator (Petit détail pro) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 z-20">
        <div className="w-1 h-10 border border-white/50 rounded-full flex justify-center py-1">
          <div className="w-1 h-2 bg-purple-500 rounded-full" />
        </div>
      </div>
    </section>
  );
}