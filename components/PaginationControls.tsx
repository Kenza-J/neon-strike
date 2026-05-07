"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();

  const goTo = (page: number) => {
    router.push(`/products?page=${page}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-16">

      {/* Bouton Précédent */}
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-500 transition"
      >
        <ChevronLeft size={18} /> Précédent
      </button>

      {/* Numéros de pages */}
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goTo(page)}
            className={`w-10 h-10 rounded-xl font-bold transition ${
              page === currentPage
                ? "bg-purple-600 text-white"
                : "bg-[#1a1a1a] border border-white/10 text-gray-400 hover:border-purple-500"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Bouton Suivant */}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-500 transition"
      >
        Suivant <ChevronRight size={18} />
      </button>

    </div>
  );
}