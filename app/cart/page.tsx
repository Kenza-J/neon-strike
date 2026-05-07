"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-white">
        <div className="bg-white/5 p-8 rounded-full">
          <ShoppingBag size={64} className="text-gray-400" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Votre panier est vide</h1>
        <p className="text-gray-400 text-center max-w-md">
          Explorez notre catalogue et ajoutez les meilleurs équipements gaming à votre setup.
        </p>
        <Link 
          href="/products" 
          className="mt-4 bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-2xl font-black transition-all"
        >
          DÉCOUVRIR LES PRODUITS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 max-w-7xl mx-auto text-white">
      <h1 className="text-4xl md:text-6xl font-black mb-12 uppercase tracking-tighter">
        Mon <span className="text-purple-500">Panier</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* LISTE DES PRODUITS (Gauche) */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#0f0f10] border border-white/5 rounded-3xl group hover:border-purple-500/30 transition-all"
            >
              {/* Image */}
              <div className="w-32 h-32 bg-black rounded-2xl overflow-hidden shrink-0 border border-white/5">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Infos & Contrôles */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white">{item.name}</h3>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-purple-500 font-bold mb-6">{item.price} MAD</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 bg-black border border-white/10 rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold min-w-[20px] text-center text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-black text-lg text-white">{item.price * item.quantity} MAD</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RÉSUMÉ DE LA COMMANDE (Droite) */}
        <div className="lg:col-span-1">
          <div className="bg-[#0f0f10] border border-white/5 p-8 rounded-[2rem] sticky top-32">
            <h2 className="text-xl font-black uppercase mb-8 tracking-widest text-gray-400 text-center">DÉTAILS COMMANDE</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span className="uppercase text-[10px] font-bold">Sous-total</span>
                <span className="text-white font-bold">{totalPrice} MAD</span>
              </div>
              <div className="flex justify-between text-gray-400 border-b border-white/5 pb-4">
                <span className="uppercase text-[10px] font-bold">Livraison</span>
                <span className="text-green-500 font-black tracking-widest text-[10px]">GRATUITE</span>
              </div>
              <div className="flex justify-between items-baseline pt-4">
                <span className="text-xl font-black text-white italic">TOTAL</span>
                <span className="text-3xl font-black text-purple-500 italic">{totalPrice} MAD</span>
              </div>
            </div>

            {/* LIEN VERS LE FORMULAIRE DE COMMANDE */}
            <Link 
              href="/checkout"
              className="w-full bg-white !text-black hover:bg-purple-600 hover:text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all group uppercase"
            >
              Passer à la caisse
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="text-[10px] text-center mt-6 text-gray-600 font-bold uppercase tracking-[0.2em]">
              Paiement à la livraison garanti au Maroc
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}