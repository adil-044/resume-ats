'use client';

import { usePathname } from 'next/navigation';
import { FloatingNav } from '@/components/ui/floating-navbar';
import {
  IconFileDescription,
  IconHelp,
  IconNews,
} from '@tabler/icons-react';

/** Aceternity Floating Navbar wired for HireReady. */
export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/workspace');

  if (isAuthPage || isDashboard) return null;

  return (
    <FloatingNav
      navItems={[
        {
          name: 'How it works',
          link: '/#how-it-works',
          icon: <IconFileDescription className="h-4 w-4 text-[#C4A574]" />,
        },
        {
          name: 'FAQ',
          link: '/#faq',
          icon: <IconHelp className="h-4 w-4 text-[#C4A574]" />,
        },
        {
          name: 'Blog',
          link: '/blog',
          icon: <IconNews className="h-4 w-4 text-[#C4A574]" />,
        },
      ]}
      ctaLabel="Get ATS-ready"
      ctaHref="/auth/login"
    />
  );
}
