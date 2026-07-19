import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Blog | HireReady — ATS & Resume Guides',
  description:
    'Practical ATS, resume keyword, and job-application guides from HireReady. Written for people who are done getting filtered.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'HireReady Blog',
    description: 'ATS and resume guides that actually help you get past the filter.',
    type: 'website',
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0C0C0B] text-[#F2EFE8]">
      <Navbar />
      <main className="max-w-[900px] mx-auto px-6 pt-32 pb-24">
        <p className="font-body text-xs uppercase tracking-[0.18em] text-[#C4A574] mb-4">
          Field notes
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-[#F2EFE8] tracking-tight mb-4">
          HireReady Blog
        </h1>
        <p className="font-body text-[#A39E93] text-base leading-relaxed max-w-xl mb-14">
          ATS filters, keyword matching, and resume tactics — same genre as our product: clear,
          confrontational, useful.
        </p>

        {posts.length === 0 ? (
          <p className="font-body text-[#6B675F]">No posts yet.</p>
        ) : (
          <ul className="space-y-0 divide-y divide-[#2A2824] border-t border-[#2A2824]">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block py-8 group hover:bg-[#161614]/40 -mx-3 px-3 transition-colors"
                >
                  <time
                    dateTime={post.date}
                    className="font-mono text-xs text-[#6B675F] tabular-nums"
                  >
                    {post.date}
                  </time>
                  <h2 className="font-display text-2xl text-[#F2EFE8] mt-2 group-hover:text-[#C4A574] transition-colors tracking-tight">
                    {post.title}
                  </h2>
                  <p className="font-body text-sm text-[#A39E93] mt-2 leading-relaxed max-w-2xl">
                    {post.description}
                  </p>
                  {post.keyword ? (
                    <p className="font-mono text-[11px] text-[#6B675F] mt-3 uppercase tracking-wider">
                      {post.keyword}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
