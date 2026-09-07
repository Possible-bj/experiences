// NEXT_PUBLIC_SITE_URL is inlined at build time, so if it wasn't set when
// Vercel built the deployment, it stays baked in as undefined until the next
// build — setting it in the dashboard alone won't fix an existing build.
// VERCEL_PROJECT_PRODUCTION_URL/VERCEL_URL have no NEXT_PUBLIC_ prefix, so
// they're read live from the server process at request time and always
// reflect the actual deployment, making them a reliable runtime fallback.
function resolveSiteUrl(): string {
  if (process.env.NEXT_SITE_URL) return process.env.NEXT_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
