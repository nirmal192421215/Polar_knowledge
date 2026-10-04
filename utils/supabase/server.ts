import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for use in:
 * - Server Components (page.tsx, layout.tsx)
 * - Route Handlers (app/api/*)
 *
 * Uses @supabase/ssr createServerClient which handles
 * cookie-based session correctly on the server.
 * 
 * NOTE: In Next.js 15+, cookies() is async. We handle
 * both patterns safely here.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookie writes in Server Components are no-ops.
            // Route Handlers can write cookies normally.
          }
        },
      },
    }
  );
}
