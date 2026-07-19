import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://hireready.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: SITE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...posts,
  ];
}
