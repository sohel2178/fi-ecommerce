'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { m } from 'framer-motion';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, status } = useAuth();
  const pathname = usePathname();

  const links = [
    { href: '/categories', label: 'Categories' },
    ...(user?.role === 'vendor' ? [{ href: '/vendor', label: 'Vendor' }] : []),
    ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 bg-primary-dark text-white">
      <div className="page flex h-14 items-center gap-6">
        <Link href="/" className="font-wide text-xl font-extrabold tracking-tight">
          Forbit
        </Link>
        <nav className="hidden h-full items-stretch gap-5 text-sm font-medium md:flex" aria-label="Main">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined} className="relative flex items-center hover:text-serenity">
                {label}
                {active && <m.span layoutId="header-marker" transition={spring} className="absolute inset-x-0 bottom-0 h-[3px] bg-serenity" />}
              </Link>
            );
          })}
        </nav>

        {/* Home has its own hero search; don't show two. */}
        <form action="/search" className={cn('ml-auto hidden w-full max-w-xs', pathname !== '/' && 'md:block')} role="search">
          <label htmlFor="header-q" className="sr-only">Search parts</label>
          <div className="flex h-9 items-center rounded-control bg-white/10 pl-3 ring-1 ring-white/20 focus-within:bg-white focus-within:text-navy focus-within:ring-white">
            <Search className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            <input id="header-q" name="q" placeholder="Part number or spec" className="h-full w-full bg-transparent px-2 text-sm placeholder:text-current placeholder:opacity-60 focus:outline-none" />
          </div>
        </form>

        <div className={cn('ml-auto flex items-center gap-1', pathname !== '/' && 'md:ml-0')}>
          <Link href="/cart" aria-label="Cart" className="hidden rounded-control p-2 hover:bg-white/10 md:block">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          {status === 'authenticated' ? (
            <Link href="/account" className="flex items-center gap-2 rounded-control px-2 py-1.5 text-sm font-medium hover:bg-white/10">
              <User className="h-5 w-5" aria-hidden />
              <span className="max-w-[9rem] truncate">{user?.name.split(' ')[0]}</span>
            </Link>
          ) : status === 'anonymous' ? (
            <Link href="/login" className="rounded-control bg-white px-3 py-1.5 text-sm font-semibold text-primary-dark hover:bg-mist">
              Log in
            </Link>
          ) : (
            <span className="h-8 w-16" aria-hidden />
          )}
        </div>
      </div>
    </header>
  );
}
