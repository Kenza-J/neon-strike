import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

// Version adaptée pour Next.js 15+ (avec Promise)
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // On filtre les produits par catégorie
  const filteredProducts = products.filter((p) => p.category.toLowerCase() === slug.toLowerCase());

  if (filteredProducts.length === 0) return notFound();

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 max-w-7xl mx-auto">
      {/* Titre style Gaming */}
      <h1 className="text-4xl md:text-6xl font-black mb-16 uppercase tracking-tighter italic">
        Catégorie : <span className="text-purple-500">{slug}</span>
      </h1>

      {/* Grille de produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map((product) => (
          <div key={product.id} className="hover:scale-[1.02] transition-transform duration-300">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}