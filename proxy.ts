/**
 * Next.js Middleware — berjalan di Edge Runtime (tanpa Node.js native modules)
 * Tidak boleh import Prisma/pg karena Edge tidak support native modules.
 * Proteksi route dilakukan dengan cek cookie session JWT dari NextAuth.
 */
import { NextRequest, NextResponse } from "next/server";

// Cookie name NextAuth v5 pakai (sesuai protokol)
const SESSION_COOKIES = [
  "authjs.session-token",           // NextAuth v5 default
  "__Secure-authjs.session-token",  // HTTPS
  "next-auth.session-token",        // NextAuth v4 compat
  "__Secure-next-auth.session-token",
];

function getSessionToken(req: NextRequest): string | undefined {
  for (const name of SESSION_COOKIES) {
    const val = req.cookies.get(name)?.value;
    if (val) return val;
  }
  return undefined;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = getSessionToken(req);
  const isLoggedIn = !!sessionToken;

  const protectedPaths = ["/checkout", "/orders"];
  const adminPaths = ["/admin"];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAdmin = adminPaths.some((p) => pathname.startsWith(p));

  if ((isProtected || isAdmin) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  // Jalankan middleware di semua route kecuali asset statis
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
