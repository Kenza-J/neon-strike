"use client";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image"; // ✅ next/image à la place de <img>
import { ShoppingCart, Eye } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-[#0f0f10] border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 shadow-xl">
      
      {/* Image optimisée next/image */}
      <div className="relative h-72 overflow-hidden bg-[#161617]">
        <Image
          src={product.image}
          alt={product.name}
          fill                          // Remplace width/height quand le parent a position:relative
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive
          quality={80}                  // Bon équilibre qualité / poids
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"               // Lazy loading par défaut (économise la bande passante)
        />

        {/* Overlay avec l'oeil */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
          <Link
            href={`/products/${product.id}`}
            className="bg-white text-black p-4 rounded-full hover:bg-purple-500 hover:text-white transition transform hover:scale-110"
          >
            <Eye size={24} />
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{product.name}</h3>
          <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded-md uppercase font-black">
            {product.category}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center border-t border-white/5 pt-4">
          <span className="text-2xl font-black text-white">
            {product.price} <span className="text-sm text-purple-500">MAD</span>
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-purple-600 p-3 rounded-xl hover:bg-purple-500 transition transform active:scale-90"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}