"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import Link from "next/link";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
};

function StarRating({
  rating,
  onRate,
  readonly = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          className={`transition-colors ${
            star <= (hovered || rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600"
          } ${!readonly ? "cursor-pointer hover:scale-110" : ""}`}
          onClick={() => !readonly && onRate?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Charger les avis
  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews/${productId}`);
    const data = await res.json();
    setReviews(data.reviews || []);
    setAvgRating(data.avgRating || 0);
    setTotal(data.total || 0);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Veuillez choisir une note.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Le commentaire doit contenir au moins 10 caractères.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de l'envoi.");
    } else {
      setSuccess(true);
      setRating(0);
      setComment("");
      fetchReviews();
    }

    setLoading(false);
  };

  return (
    <div className="mt-16 border-t border-white/10 pt-12">
      <h2 className="text-2xl font-black uppercase mb-2">
        Avis clients
      </h2>

      {/* Résumé note */}
      {total > 0 && (
        <div className="flex items-center gap-4 mb-8">
          <div className="text-5xl font-black text-yellow-400">{avgRating}</div>
          <div>
            <StarRating rating={Math.round(avgRating)} readonly />
            <p className="text-gray-400 text-sm mt-1">{total} avis</p>
          </div>
        </div>
      )}

      {/* Formulaire d'avis */}
      <div className="bg-[#0f0f10] border border-white/10 rounded-2xl p-6 mb-8">
        <h3 className="font-black uppercase text-lg mb-4">Laisser un avis</h3>

        {!session ? (
          <p className="text-gray-400 text-sm">
            <Link href="/auth/login" className="text-purple-400 font-bold hover:text-purple-300">
              Connectez-vous
            </Link>{" "}
            pour laisser un avis.
          </p>
        ) : success ? (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
            ✅ Merci pour votre avis !
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Votre note</label>
              <StarRating rating={rating} onRate={setRating} />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">Votre commentaire</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full p-4 bg-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
                placeholder="Partagez votre expérience avec ce produit..."
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
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              {loading ? "Envoi..." : "Publier mon avis"}
            </button>
          </form>
        )}
      </div>

      {/* Liste des avis */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aucun avis pour l'instant. Soyez le premier !
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#0f0f10] border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold">{review.user.name || "Anonyme"}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <StarRating rating={review.rating} readonly />
              </div>
              <p className="text-gray-300 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}