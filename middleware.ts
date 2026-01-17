import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rutas que requieren autenticación obligatoria
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/billing(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const currentUrl = req.nextUrl;
  const hostname = req.headers.get("host");
  if (!hostname) return NextResponse.next();

  // Limpieza del host (quitamos puertos si es localhost)
  const currentHost = hostname.replace(`:3000`, "");
  const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";

  // 1. DETECTAR SI ES UN SUBDOMINIO DE CLIENTE (TENANT)
  // Si el host NO es el dominio principal, asumimos que es una tienda (ej: pizzeria.mirrorq.com)
  const isTenantSubdomain = currentHost !== mainDomain && currentHost !== `www.${mainDomain}`;

  if (isTenantSubdomain) {
    // Reescribimos la URL para que Next.js cargue app/[domain]/page.tsx
    const newUrl = new URL(currentUrl);
    newUrl.pathname = `/${currentHost}${currentUrl.pathname}`;
    return NextResponse.rewrite(newUrl);
  }

  // 2. LÓGICA DEL DOMINIO PRINCIPAL (Tu Dashboard y Landing)
  
  // A. Proteger rutas privadas (/dashboard, /settings, etc)
  if (isProtectedRoute(req)) {
    const authObj = await auth();
    if (!authObj.userId) {
      return authObj.redirectToSignIn();
    }
  }

  // B. Redirección Inteligente en el Home "/"
  // Si el usuario entra a la raíz y YA está logueado, lo mandamos al dashboard en lugar de la landing
  if (currentUrl.pathname === '/') {
    const authObj = await auth();
    if (authObj.userId) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // Si no está logueado, Next.js mostrará app/(marketing)/page.tsx automáticamente
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};