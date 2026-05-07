// ✅ Server Component par défaut — PAS de 'use client'
import { products } from "@/data/products";
import ProductList from "@/components/ProductList";
import PaginationControls from "@/components/PaginationControls";
import { Zap } from "lucide-react";

const PRODUCTS_PER_PAGE = 6;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // ✅ Await obligatoire dans Next.js 15+
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="bg-black min-h-screen">

      {/* Header du catalogue */}
      <div className="py-20 px-6 text-center border-b border-white/5 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black">
        <div className="inline-flex items-center gap-2 text-purple-500 font-bold tracking-[0.2em] uppercase text-sm mb-4">
          <Zap size={16} fill="currentColor" /> Boutique Officielle
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
          Tout l'attirail <span className="text-purple-600 italic">Neon.</span>
        </h1>
        <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-lg">
          Découvrez notre sélection de périphériques et composants haute performance,
          conçus pour repousser les limites de votre setup.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">

        <p className="text-gray-500 text-sm mb-8">
          Page <span className="text-white font-bold">{currentPage}</span> sur{" "}
          <span className="text-white font-bold">{totalPages}</span> —{" "}
          <span className="text-purple-400">{products.length} produits</span>
        </p>

        <ProductList products={paginatedProducts} />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>

    </div>
  );
}