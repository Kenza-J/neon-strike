// ✅ Server Component — PAS de "use client"
// generateMetadata() ne fonctionne que dans les Server Components
import { products } from "@/data/products";
import { Metadata } from "next";
import ProductClient from "./ProductClient";

// ============================================================
// METADATA DYNAMIQUE — SEO pour chaque fiche produit
// Google affiche : "Phantom Gaming Mouse | Neon Strike"
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return { title: "Produit non trouvé | Neon Strike" };
  }

  return {
    title: `${product.name} | Neon Strike`,
    description: `${product.description} — ${product.price} MAD. Livraison rapide au Maroc.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [`https://neon-strike-woad.vercel.app${product.image}`],
      type: "website",
    },
  };
}

// ============================================================
// JSON-LD — Données structurées Schema.org
// Google peut afficher : prix, disponibilité, marque
// ============================================================
function ProductJsonLd({ product }: { product: any }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://neon-strike-woad.vercel.app${product.image}`,
    brand: {
      "@type": "Brand",
      name: "Neon Strike",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Neon Strike",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================================
// PAGE PRINCIPALE — Server Component
// ============================================================
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  return (
    <>
      {/* ✅ JSON-LD injecté dans le <head> par Next.js */}
      {product && <ProductJsonLd product={product} />}

      {/* ✅ Partie interactive déléguée au Client Component */}
      <ProductClient productId={id} />
    </>
  );
}