"use client";
import { useEffect, useState } from "react";
import { Wifi, WifiOff, Package } from "lucide-react";

type StockData = Record<string, number>;

export default function StockDashboard() {
  const [stock, setStock] = useState<StockData>({});
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    // ✅ Connexion SSE au stream de stock
    const eventSource = new EventSource("/api/stock/stream");

    eventSource.onopen = () => {
      setConnected(true);
      console.log("📡 SSE connecté");
    };

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "init") {
        // Stock initial complet
        setStock(data.stock);
      } else {
        // Mise à jour d'un seul produit
        setStock((prev) => ({ ...prev, [data.sku]: data.stock }));
        setLastUpdate(`${data.sku} → ${data.stock} unités (${new Date(data.updatedAt).toLocaleTimeString("fr-FR")})`);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      console.error("❌ SSE déconnecté");
    };

    // Nettoyage à la déconnexion
    return () => eventSource.close();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black uppercase">📦 Stock en temps réel</h1>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${connected ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
          {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
          {connected ? "SSE Connecté" : "Déconnecté"}
        </div>
      </div>

      {/* Dernière mise à jour */}
      {lastUpdate && (
        <div className="mb-6 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 text-sm">
          🔄 Dernière mise à jour : {lastUpdate}
        </div>
      )}

      {/* Grille stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stock).map(([sku, qty]) => (
          <div
            key={sku}
            className={`p-4 rounded-xl border transition-all ${
              qty <= 3
                ? "bg-red-500/10 border-red-500/30"
                : qty <= 8
                ? "bg-yellow-500/10 border-yellow-500/30"
                : "bg-[#1a1a1a] border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-purple-400" />
                <span className="text-sm font-mono text-gray-300">{sku}</span>
              </div>
              <span className={`text-2xl font-black ${qty <= 3 ? "text-red-400" : qty <= 8 ? "text-yellow-400" : "text-white"}`}>
                {qty}
              </span>
            </div>
            {qty <= 3 && (
              <p className="text-xs text-red-400 mt-2">⚠️ Stock critique</p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}