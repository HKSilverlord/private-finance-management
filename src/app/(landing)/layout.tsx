'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return <div className="min-h-screen bg-background overflow-hidden relative">{children}</div>;
}
