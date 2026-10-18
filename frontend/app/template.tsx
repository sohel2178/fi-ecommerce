'use client';

import { useEffect } from 'react';
import { m } from 'framer-motion';
import { quick } from '@/lib/motion';

// The server-rendered first page must be visible before hydration, so only client-side
// navigations (template remounts) animate.
let hydrated = false;

/** Route-change transition. App Router remounts templates on navigation; there is no exit animation. */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hydrated;
  useEffect(() => {
    hydrated = true;
  }, []);
  return (
    <m.div initial={animate ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} transition={quick}>
      {children}
    </m.div>
  );
}
