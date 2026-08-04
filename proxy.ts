import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/quiz", "/results"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

/**
 * Proxy (formerly middleware) that protects dashboard, quiz, and results routes.
 *
 * - Unauthenticated users → redirected to /login.
 * - Authenticated but non-premium users on /quiz or /results → redirected to /pricing?access=required.
 * - The session cookie is refreshed on every request.
 */
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not set. " +
        "Add it to your .env.local file from your Supabase project settings.",
    );
  }
  if (!supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. " +
        "Add it to your .env.local file from your Supabase project settings.",
    );
  }

  const { pathname } = request.nextUrl;

  // Only apply session checks for protected routes
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session & get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session → redirect to login with ?redirect= path for post-login routing
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optional: check is_premium for /quiz and /results
  const requiresPremium =
    pathname.startsWith("/quiz") || pathname.startsWith("/results");

  if (requiresPremium) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium")
      .eq("id", user.id)
      .single();

    if (profile && !profile.is_premium) {
      const pricingUrl = new URL("/pricing", request.url);
      pricingUrl.searchParams.set("access", "required");
      return NextResponse.redirect(pricingUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (e.g. robots.txt)
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|api).*)",
  ],
};