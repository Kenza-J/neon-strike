 "use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { products } from "@/data/products";
import Link from "next/link";
import Image from "next/image";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof products>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Recherche en temps réel
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setIsOpen(true);
  }, [query]);

  // Fermer quand on clique dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      {/* Input */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-purple-500 transition">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit..."
          className="bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none w-full"
        />
        {query && (
          <button onClick={handleClear}>
            <X size={16} className="text-gray-400 hover:text-white transition" />
          </button>
        )}
      </div>

      {/* Résultats */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f10] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
          {results.length === 0 ? (
            <div className="p-4 text-gray-400 text-sm text-center">
              Aucun produit trouvé pour "{query}"
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={handleClear}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 transition"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{product.name}</p>
                    <p className="text-gray-400 text-xs truncate">{product.description}</p>
                  </div>
                  <span className="text-purple-400 font-bold text-sm shrink-0">
                    {product.price} MAD
                  </span>
                </Link>
              ))}
              <div className="p-2 border-t border-white/5 text-center">
                <Link
                  href={`/products?search=${query}`}
                  onClick={handleClear}
                  className="text-purple-400 text-xs hover:text-purple-300 font-bold"
                >
                  Voir tous les résultats ({results.length})
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
