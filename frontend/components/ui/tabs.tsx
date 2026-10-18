'use client';

import { useRef, type KeyboardEvent } from 'react';
import { m } from 'framer-motion';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Item<T extends string> = { value: T; label: string };

/**
 * Animated tabs. `segmented` is a two-up switch (login); `pills` scrolls horizontally (status filters).
 * The selection marker slides between items via a shared layoutId. Arrow keys move selection.
 */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  id,
  variant = 'segmented',
  label,
}: {
  items: Item<T>[];
  value: T;
  onChange: (value: T) => void;
  id: string;
  variant?: 'segmented' | 'pills';
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: KeyboardEvent, index: number) {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + items.length) % items.length;
    onChange(items[next].value);
    refs.current[next]?.focus();
  }

  const segmented = variant === 'segmented';
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        segmented ? 'grid rounded-control bg-serenity/60 p-1' : '-mx-4 flex gap-1 overflow-x-auto px-4 pb-1',
      )}
      style={segmented ? { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` } : undefined}
    >
      {items.map((item, i) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              'relative shrink-0 text-sm font-semibold transition-colors',
              segmented ? 'h-10 rounded-[4px]' : 'h-10 rounded-full px-4',
              active ? (segmented ? 'text-navy' : 'text-white') : 'text-navy/70 hover:text-navy',
            )}
          >
            {active && (
              <m.span
                layoutId={`${id}-marker`}
                transition={spring}
                className={cn('absolute inset-0', segmented ? 'rounded-[4px] bg-white' : 'rounded-full bg-navy')}
                aria-hidden
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
