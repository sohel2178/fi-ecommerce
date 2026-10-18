'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { m } from 'framer-motion';
import { Home, LayoutGrid, Search, ShoppingCart, User } from 'lucide-react';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/account', label: 'Account', icon: User },
];

/** Phone-only bottom navigation; hidden from md (768 px) up. The marker slides to the active item. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-serenity bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href} className="relative">
              {active && <m.span layoutId="bottom-marker" transition={spring} className="absolute inset-x-4 top-0 h-[3px] rounded-b bg-primary" aria-hidden />}
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn('flex flex-col items-center gap-0.5 pb-2 pt-2.5 text-[11px] font-medium', active ? 'text-primary' : 'text-navy/70')}
              >
                <Icon className="h-5 w-5" aria-hidden strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
