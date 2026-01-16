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

  // 1. Subdominios de Restaurantes
  if (currentHost !== mainDomain && currentHost !== appDomain) {
    const newUrl = new URL(currentUrl);
    newUrl.pathname = `/${currentHost}${currentUrl.pathname}`;
    return NextResponse.rewrite(newUrl);
  }

  // 2. Dashboard (App)
  if (currentHost === appDomain) {
    // A. Permitir acceso directo a login/registro sin reescribir a dashboard
    if (currentUrl.pathname.startsWith('/sign-in') || currentUrl.pathname.startsWith('/sign-up')) {
      return NextResponse.next();
    }

    // B. Proteger Dashboard
    if (currentUrl.pathname === '/' || isDashboardRoute(req)) {
      const authObj = await auth();
      if (!authObj.userId) {
        return authObj.redirectToSignIn();
      }
    }

    // C. Reescribir el resto a /dashboard
    const newUrl = new URL(currentUrl);
    newUrl.pathname = `/dashboard${currentUrl.pathname}`;
    return NextResponse.rewrite(newUrl);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};