"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
    } else {
      router.push("/auth/login?registered=true");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#0f0f10] border border-white/10 rounded-2xl p-8">

        <h1 className="text-3xl font-black uppercase mb-2">Créer un compte</h1>
        <p className="text-gray-500 text-sm mb-8">Rejoignez la communauté Neon Strike</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              placeholder="Votre nom"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold uppercase tracking-wider transition"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-bold">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}