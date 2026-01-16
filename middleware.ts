import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const currentUrl = req.nextUrl;
  const hostname = req.headers.get("host");
  if (!hostname) return NextResponse.next();

  const currentHost = hostname.replace(`:3000`, "");
  const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";
  const appDomain = `app.${mainDomain}`;

  // 1. Subdominios de Tenants (ej: pizzeria.localhost)
  if (currentHost !== mainDomain && currentHost !== appDomain) {
    const newUrl = new URL(currentUrl);
    newUrl.pathname = `/${currentHost}${currentUrl.pathname}`;
    return NextResponse.rewrite(newUrl);
  }

  // 2. Dashboard App (app.localhost)
  if (currentHost === appDomain) {
    // A. Rutas públicas de Auth (Login/Register)
    // Deben pasar sin auth y sin reescritura
    if (currentUrl.pathname.startsWith('/sign-in') || currentUrl.pathname.startsWith('/sign-up')) {
      return NextResponse.next();
    }

    // B. Protección de Rutas (Auth Guard)
    // Protegemos la raíz "/" y cualquier ruta interna
    const authObj = await auth();
    if (!authObj.userId) {
      return authObj.redirectToSignIn();
    }

    // C. Lógica de Enrutamiento (CORREGIDA)
    // Solo si el usuario va a la raíz "/", lo mandamos a la carpeta "/dashboard"
    if (currentUrl.pathname === '/') {
        const newUrl = new URL(currentUrl);
        newUrl.pathname = `/dashboard`;
        return NextResponse.rewrite(newUrl);
    }

    // Para cualquier otra ruta (como /settings, /billing), dejamos que Next.js la maneje normalmente.
    // Esto buscará el archivo en app/(app)/settings/page.tsx
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};