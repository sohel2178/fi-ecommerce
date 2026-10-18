'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { quick, spring } from '@/lib/motion';
import { useMedia } from '@/lib/use-media';

/** Bottom sheet on phones, centred panel from md. Escape and backdrop close it; focus moves inside. */
export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const desktop = useMedia('(min-width: 768px)');
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('textarea, input, button')?.focus());
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  const variants = desktop
    ? { hidden: { opacity: 0, scale: 0.98 }, shown: { opacity: 1, scale: 1 } }
    : { hidden: { y: '100%', transition: quick }, shown: { y: 0, transition: spring } };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={quick}
          onClick={onClose}
        >
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={variants}
            initial="hidden"
            animate="shown"
            exit="hidden"
            transition={quick}
            className="w-full rounded-t-panel border-t-4 border-primary bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:max-w-md md:rounded-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-serenity md:hidden" aria-hidden />
            <h2 className="text-lg">{title}</h2>
            <div className="mt-4">{children}</div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
