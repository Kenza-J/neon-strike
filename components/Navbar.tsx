"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Zap, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Calcul du nombre total d'articles
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter group">
          <div className="bg-purple-600 p-1.5 rounded-lg group-hover:bg-purple-500 transition-colors">
            <Zap size={20} fill="white" className="text-white" />
          </div>
          <span>NEON <span className="text-purple-500">STRIKE</span></span>
        </Link>

        {/* LINKS (Desktop) */}
        <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link href="/products" className="hover:text-white transition-colors">Boutique</Link>
          <Link href="/category/accessories" className="hover:text-white transition-colors">Accessoires</Link>
          <Link href="/category/audio" className="hover:text-white transition-colors">Audio</Link>
          <Link href="/category/consoles" className="hover:text-white transition-colors">Consoles</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
        </div>

        {/* CART & MOBILE BUTTON */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all group">
            <ShoppingCart size={22} className="group-hover:text-purple-400 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-pulse">
                {itemCount}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10 p-6 flex flex-col gap-6 text-center font-bold uppercase tracking-widest text-gray-400">
          <Link href="/products" onClick={() => setIsOpen(false)} className="hover:text-white">Boutique</Link>
          <Link href="/category/accessories" onClick={() => setIsOpen(false)} className="hover:text-white">Accessoires</Link>
          <Link href="/category/audio" onClick={() => setIsOpen(false)} className="hover:text-white">Audio</Link>
          <Link href="/category/consoles" onClick={() => setIsOpen(false)} className="hover:text-white text-purple-500">Consoles</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-white">Support</Link>
        </div>
      )}
    </nav>
  );
}