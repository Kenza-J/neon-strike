import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75, 80],
  },

  // ============================================================
  // CACHE HTTP — Headers de cache pour optimiser les performances
  // ============================================================
  async headers() {
    return [
      {
        // ✅ Assets statiques Next.js (JS, CSS) — cache 1 an immutable
        // Ces fichiers ont un hash dans leur nom → jamais les mêmes
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // ✅ Images optimisées next/image — cache 1 semaine
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // ✅ Pages HTML — toujours revalider (contenu peut changer)
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;