import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'HireReady Campaign | Stop Getting Ghosted by ATS',
  description:
    'A cinematic look at how HireReady scores your resume against the job, rewrites duties for ATS alignment, and gets you past the filter — free.',
  openGraph: {
    title: 'HireReady Campaign | Stop Getting Ghosted by ATS',
    description:
      'Score. Gaps. Rewrite. A free ATS toolkit that frames your real experience — not another keyword cloud.',
    url: `${SITE_URL}/campaign`,
    siteName: 'HireReady',
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/campaign`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
