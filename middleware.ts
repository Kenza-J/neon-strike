import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const variant = request.cookies.get("ab-cta-variant")?.value;

  if (variant) {
    return NextResponse.next();
  }

  const newVariant = Math.random() < 0.5 ? "control" : "experiment";
  const response = NextResponse.next();

  response.cookies.set("ab-cta-variant", newVariant, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false,
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/products/:path*"],
};