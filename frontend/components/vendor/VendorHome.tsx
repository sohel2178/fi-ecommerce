'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, ApiError, refreshSession } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { vendorStatusTone } from '@/lib/vendor-status';
import type { Vendor } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button-variants';

const statusText: Record<Vendor['status'], string> = {
  pending: 'Under review. You can list parts once Forbit approves your shop.',
  approved: 'Approved. Your shop can supply parts to Forbit.',
  rejected: 'Not approved.',
  suspended: 'Suspended. Your listings are hidden until Forbit reinstates the shop.',
};

const upcoming = [
  { title: 'Listings', text: 'Add parts with your supplier price and stock.' },
  { title: 'Bulk CSV upload', text: 'Update prices and stock for many parts at once.' },
  { title: 'Payouts', text: 'See what Forbit owes you for delivered orders.' },
];

export function VendorHome() {
  const { user, status } = useAuth();
  const { data, error, isLoading } = useQuery({
    queryKey: ['vendor', 'me'],
    queryFn: () => api<{ vendor: Vendor }>('/vendor/me').then((r) => r.vendor),
    enabled: status === 'authenticated',
    retry: false,
  });

  // Approval changes the role on the server; refresh so the access token carries it.
  useEffect(() => {
    if (data?.status === 'approved' && user?.role === 'customer') void refreshSession();
  }, [data?.status, user?.role]);

  if (status === 'loading' || isLoading) return <Card className="h-40 animate-pulse bg-white/60" />;

  if (error instanceof ApiError && error.status === 404) {
    if (user?.role === 'admin') return <Alert>Admins manage suppliers from the admin panel.</Alert>;
    return (
      <EmptyState title="You don't supply parts to Forbit yet" action={{ href: '/vendor/apply', label: 'Apply to supply parts' }}>
        <p>List your stock at your own supplier price. Forbit runs the shop, takes payment and delivers to the customer.</p>
      </EmptyState>
    );
  }
  if (error) return <Alert tone="error">{(error as Error).message}</Alert>;
  if (!data) return null;

  return (
    <div className="max-w-3xl space-y-8">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl">{data.shopName}</h2>
          <Badge tone={vendorStatusTone[data.status]} className="capitalize">{data.status}</Badge>
        </div>
        <p className="mt-2 text-navy/75">
          {statusText[data.status]}
          {data.statusNote && data.status !== 'approved' && <> Reason: {data.statusNote}</>}
        </p>
        {data.status === 'rejected' && (
          <Link href="/vendor/apply" className={buttonVariants({ variant: 'secondary', className: 'mt-4' })}>
            Update and apply again
          </Link>
        )}
      </Card>

      {data.status === 'approved' && (
        <section aria-labelledby="upcoming">
          <h2 id="upcoming" className="text-lg">Opening with the catalogue</h2>
          <ul className="mt-3 divide-y divide-serenity border-y border-serenity">
            {upcoming.map((u) => (
              <li key={u.title} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-6">
                <span className="font-semibold sm:w-40">{u.title}</span>
                <span className="text-navy/70">{u.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
