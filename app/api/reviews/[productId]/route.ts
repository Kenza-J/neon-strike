 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET /api/reviews/[productId] — Récupérer les avis d'un produit
export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: params.productId },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({
      reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      total: reviews.length,
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
