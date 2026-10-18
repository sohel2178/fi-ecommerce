'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { m, type Variants } from 'framer-motion';
import { CABINET } from '@/lib/cabinet';
import { ease, spring } from '@/lib/motion';

// The one load sequence on the site: drawers slide into the cabinet the first time it mounts in
// this page load. Returning to home through in-app navigation shows it settled.
let played = false;

const cabinet: Variants = { shown: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } };
const drawer: Variants = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.34, ease } },
};

export function PartsCabinet() {
  const first = !played;
  useEffect(() => {
    played = true;
  }, []);

  return (
    <section className="page" aria-labelledby="cabinet-title">
      <h2 id="cabinet-title" className="text-xl md:text-2xl">
        Parts cabinet
      </h2>
      <p className="mt-1 text-navy/70">Pull a drawer to browse a category.</p>

      {/* Without JS the drawers would stay hidden at their initial state. */}
      <noscript>
        <style>{`.cabinet-drawer{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <m.ul
        className="mt-4 grid grid-cols-2 gap-1.5 rounded-panel bg-navy p-1.5 sm:grid-cols-3 md:gap-2 md:p-2 lg:grid-cols-4"
        variants={cabinet}
        initial={first ? 'hidden' : false}
        animate="shown"
      >
        {CABINET.map((c) => (
          <m.li key={c.slug} variants={drawer} className="cabinet-drawer rounded-drawer bg-[#06172d]">
            <Link href={`/categories?c=${c.slug}`} className="block h-full rounded-drawer focus-visible:ring-offset-navy">
              <m.div
                className="flex h-full min-h-[7.5rem] flex-col items-center justify-between gap-3 rounded-drawer bg-serenity px-2.5 pb-3.5 pt-2.5 md:min-h-[8rem]"
                whileHover={{ y: -3, scale: 1.015, boxShadow: '0 10px 14px -8px rgba(3, 12, 26, 0.7)' }}
                whileTap={{ y: -5, scale: 1.02 }}
                transition={spring}
              >
                {/* Paper label slot */}
                <span className="block w-full max-w-[15rem] rounded-[2px] border border-navy/25 bg-white px-2 py-1.5 text-center">
                  <span className="block text-sm font-bold leading-tight md:text-[0.95rem]">{c.name}</span>
                  <span className="part mt-0.5 block text-[0.72rem] leading-snug text-navy/70">{c.parts}</span>
                </span>
                {/* Pull handle */}
                <span className="block h-2 w-14 rounded-full bg-navy/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" aria-hidden />
              </m.div>
            </Link>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
}
