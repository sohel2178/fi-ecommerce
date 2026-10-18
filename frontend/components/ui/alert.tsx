'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { reveal } from '@/lib/motion';
import { cn } from '@/lib/utils';

const tones = {
  error: 'border-danger/40 bg-[#fdf1f1] text-[#a61b1b]',
  info: 'border-primary/30 bg-white text-navy',
  success: 'border-success/40 bg-[#effaf3] text-navy',
  warning: 'border-warning/50 bg-[#fff8eb] text-navy',
};

/**
 * Status message that grows into place instead of pushing the layout. Pass `show` to animate it
 * out as well; without `show` it animates in when mounted.
 */
export function Alert({
  tone = 'info',
  show = true,
  children,
  className,
}: {
  tone?: keyof typeof tones;
  show?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <m.div {...reveal} className={cn('overflow-hidden', className)}>
          <div role={tone === 'error' ? 'alert' : 'status'} className={cn('rounded-control border-l-4 border px-3 py-2 text-sm', tones[tone])}>
            {children}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
