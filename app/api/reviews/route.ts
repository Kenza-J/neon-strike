import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

// ✅ POST /api/reviews — Créer un avis
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour laisser un avis." },
        { status: 401 }
      );
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit être entre 1 et 5." },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existing = await prisma.review.findFirst({
      where: { productId, userId: user.id },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Vous avez déjà laissé un avis pour ce produit." },
        { status: 400 }
      );
    }

    // Créer l'avis
    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating,
        comment,
      },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json(review, { status: 201 });

  } catch (error: any) {
    console.error("Erreur review:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
