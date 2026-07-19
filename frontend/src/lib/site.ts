/** Canonical public site URL for SEO (sitemap, OG, robots). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://hire-ready.app';
