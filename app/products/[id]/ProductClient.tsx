"use client";

import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, CheckCircle2, CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { plausibleViewItem, plausibleAddToCart } from "@/lib/plausible";

export default function ProductClient({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === productId);

  // ✅ view_item — déclenché au chargement de la fiche produit
  useEffect(() => {
    if (product) {
      trackViewItem(product);
      plausibleViewItem(product.name, product.category);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-black uppercase tracking-widest text-red-500">
          Produit non trouvé : {productId}
        </h1>
        <Link href="/products" className="px-8 py-4 bg-purple-600 rounded-full font-bold hover:bg-purple-500 transition">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-500 mb-10 transition font-bold uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} /> Retour au catalogue
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* IMAGE DU PRODUIT */}
          <div className="bg-[#0f0f10] border border-white/5 rounded-[2.5rem] overflow-hidden flex items-center justify-center p-12">
            <img src={product.image} alt={product.name} className="w-full h-auto object-contain" />
          </div>

          {/* FICHE DÉTAILLÉE */}
          <div className="flex flex-col">
            <span className="text-purple-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">{product.category}</span>
            <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">{product.name}</h1>
            <p className="text-3xl font-bold text-white mb-10">{product.price} <span className="text-purple-500 text-lg">MAD</span></p>

            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 font-mono">Fiche Technique</h3>
            <div className="space-y-3 mb-12">
              {product.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 size={18} className="text-purple-500" />
                  <span className="text-gray-300 font-medium">{spec}</span>
                </div>
              ))}
            </div>

            {/* RÉASSURANCE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                <CreditCard className="text-green-500" size={20} />
                <span className="text-[10px] font-black uppercase text-green-500">Paiement Cash à la livraison</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <ShieldCheck className="text-blue-500" size={20} />
                <span className="text-[10px] font-black uppercase text-blue-500">Garantie 2 ans</span>
              </div>
            </div>

            {/* ✅ BOUTON avec trackAddToCart */}
            <button
              onClick={() => {
                trackAddToCart(product, 1);
                plausibleAddToCart(product.name, product.price);
                addToCart(product);
              }}
              className="w-full bg-white text-black hover:bg-purple-600 hover:text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl"
            >
              <ShoppingCart size={24} /> AJOUTER AU PANIER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}