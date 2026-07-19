import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...posts,
  ];
}
