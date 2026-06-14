import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import Script from "next/script";
import Providers from "@/components/Providers"; // ✅ NextAuth Providers

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NEON STRIKE | Premium Gaming Gear",
  description: "Boutique e-commerce haute performance pour setups gaming et hardware premium.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', {
              debug_mode: true
            });
          `}
        </Script>

        {/* PLAUSIBLE */}
        <Script
          defer
          data-domain="neon-strike.vercel.app"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>

      <body className={`${inter.className} bg-black text-white antialiased selection:bg-purple-500/30 selection:text-purple-200`}>
        {/* ✅ Providers gère SessionProvider côté client */}
        <Providers>
          <CartProvider>
            <header>
              <Navbar />
            </header>

            <main className="min-h-screen relative overflow-x-hidden">
              {children}
            </main>

            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}