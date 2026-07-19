import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogMarkdown from '@/components/BlogMarkdown';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post not found | HireReady' };
  return {
    title: `${post.title} | HireReady`,
    description: post.description,
    keywords: [post.keyword, ...post.tags].filter(Boolean),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://hireready.app/blog/${post.slug}`,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#0C0C0B] text-[#F2EFE8]">
      <Navbar />
      <article className="max-w-[720px] mx-auto px-6 pt-32 pb-24">
        <Link
          href="/blog"
          className="font-body text-sm text-[#A39E93] hover:text-[#C4A574] transition-colors"
        >
          ← All posts
        </Link>
        <header className="mt-8 mb-12">
          <time dateTime={post.date} className="font-mono text-xs text-[#6B675F] tabular-nums">
            {post.date}
          </time>
          <h1 className="font-display text-3xl md:text-5xl text-[#F2EFE8] tracking-tight mt-3 mb-5">
            {post.title}
          </h1>
          <p className="font-body text-[#A39E93] text-lg leading-relaxed">{post.description}</p>
        </header>

        <BlogMarkdown content={post.content} />

        <div className="mt-16 pt-10 border-t border-[#2A2824]">
          <p className="font-display text-xl text-[#F2EFE8] mb-3">Ready to stop guessing?</p>
          <p className="font-body text-sm text-[#A39E93] mb-6 leading-relaxed">
            Paste your resume and a job description. HireReady scores the match and rewrites what
            the ATS is filtering — free.
          </p>
          <Link href="/#analyzer" className="btn-signal inline-block px-6 py-3 rounded-md text-sm">
            Analyze free
          </Link>
        </div>
      </article>
      <Footer />
    </div>
  );
}
