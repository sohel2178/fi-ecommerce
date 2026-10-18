'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Search } from 'lucide-react';
import { QUICK_SEARCHES, SEARCH_EXAMPLES } from '@/lib/cabinet';
import { quick } from '@/lib/motion';

/** Typographic hero: the search field is the working part. Example part numbers cycle until focus. */
export function HeroSearch() {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (focused || value) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SEARCH_EXAMPLES.length), 2400);
    return () => clearInterval(t);
  }, [focused, value]);

  return (
    <section className="page pb-10 pt-8 md:pb-14 md:pt-16">
      <h1 className="max-w-[16ch] font-wide text-[clamp(2.1rem,7.5vw,3.0625rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
        Find the part. We&apos;ll deliver it.
      </h1>
      <p className="mt-4 max-w-[52ch] text-navy/75 md:text-lg">
        Search cells, BMS boards, microcontrollers and passives by part number or spec. Pay online or cash on delivery.
      </p>

      <form action="/search" role="search" className="mt-6 max-w-2xl md:mt-8">
        <label htmlFor="hero-q" className="sr-only">
          Search by part number or spec
        </label>
        <div className="flex h-14 items-stretch rounded-control border-2 border-navy bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
          <div className="relative min-w-0 flex-1">
            <input
              id="hero-q"
              name="q"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="h-full w-full bg-transparent px-4 text-lg focus:outline-none"
            />
            {!value && (
              <span className="pointer-events-none absolute inset-y-0 left-4 right-2 flex items-center overflow-hidden text-lg text-navy/50" aria-hidden>
                <span className="mr-2 shrink-0">Try</span>
                <AnimatePresence mode="wait" initial={false}>
                  <m.span
                    key={SEARCH_EXAMPLES[index]}
                    className="part truncate text-navy/65"
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={quick}
                  >
                    {SEARCH_EXAMPLES[index]}
                  </m.span>
                </AnimatePresence>
              </span>
            )}
          </div>
          <button type="submit" className="m-1.5 flex items-center gap-2 rounded-[4px] bg-primary px-4 font-semibold text-white hover:bg-primary-dark">
            <Search className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">Search</span>
            <span className="sr-only sm:hidden">Search</span>
          </button>
        </div>
      </form>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Popular searches">
        {QUICK_SEARCHES.map(({ q, label }) => (
          <li key={q}>
            <Link
              href={`/search?q=${encodeURIComponent(q)}`}
              className="inline-flex h-9 items-center rounded-full border border-navy/15 bg-white px-3.5 text-sm font-medium hover:border-primary hover:text-primary-dark"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
