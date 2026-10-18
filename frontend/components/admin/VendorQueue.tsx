'use client';

import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, m } from 'framer-motion';
import { FileText } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { vendorStatusTone } from '@/lib/vendor-status';
import type { Paged, Vendor, VendorStatus } from '@/lib/types';
import { quick } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Dialog } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';

// A row whose status changed slides out of the current tab, so the admin sees where it went.
const row = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, x: 24, transition: quick },
};

const TABS: VendorStatus[] = ['pending', 'approved', 'suspended', 'rejected'];
type Action = 'approve' | 'reject' | 'suspend';

const actionsFor: Record<VendorStatus, Action[]> = {
  pending: ['approve', 'reject'],
  approved: ['suspend'],
  suspended: ['approve'],
  rejected: [],
};
const actionLabel: Record<Action, string> = { approve: 'Approve', reject: 'Reject', suspend: 'Suspend' };

export function VendorQueue() {
  const [tab, setTab] = useState<VendorStatus>('pending');
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<{ vendor: Vendor; action: Action } | null>(null);
  const [note, setNote] = useState('');
  const authed = useAuth((s) => s.status === 'authenticated');
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'vendors', tab, page],
    queryFn: () => api<Paged<Vendor>>(`/admin/vendors?status=${tab}&page=${page}&limit=20`),
    enabled: authed,
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: ({ id, action, note }: { id: string; action: Action; note?: string }) =>
      api(`/admin/vendors/${id}/${action}`, { method: 'PATCH', body: note ? { note } : {} }),
    onSuccess: () => {
      setPending(null);
      setNote('');
      void qc.invalidateQueries({ queryKey: ['admin', 'vendors'] });
    },
  });

  async function openLicense(id: string) {
    // Open the tab synchronously so pop-up blockers allow it, then point it at the signed URL.
    const win = window.open('', '_blank');
    try {
      const { url } = await api<{ url: string }>(`/admin/vendors/${id}/license-url`);
      if (win) win.location.href = url;
    } catch (e) {
      win?.close();
      alert(e instanceof ApiError ? e.message : 'Could not open license');
    }
  }

  const items = query.data?.items ?? [];
  const pages = query.data ? Math.max(1, Math.ceil(query.data.total / query.data.limit)) : 1;

  function renderActions(v: Vendor) {
    return (
      <div className="flex flex-wrap gap-2">
        {v.hasTradeLicense && (
          <Button size="sm" variant="outline" onClick={() => openLicense(v.id)}>
            <FileText className="h-4 w-4" aria-hidden /> View license
          </Button>
        )}
        {v.type !== 'inhouse' &&
          actionsFor[v.status].map((a) => (
            <Button
              key={a}
              size="sm"
              variant={a === 'approve' ? 'success' : 'danger'}
              onClick={() => {
                mutation.reset();
                setPending({ vendor: v, action: a });
              }}
            >
              {actionLabel[a]}
            </Button>
          ))}
      </div>
    );
  }

  return (
    <div>
      <Tabs
        id="vendor-status"
        label="Vendor status"
        variant="pills"
        value={tab}
        onChange={(t) => {
          setTab(t);
          setPage(1);
        }}
        items={TABS.map((t) => ({ value: t, label: t[0].toUpperCase() + t.slice(1) }))}
      />

      {query.error && <Alert tone="error" className="mt-4">{(query.error as Error).message}</Alert>}
      {query.isLoading && <div className="mt-4 h-40 animate-pulse rounded-panel bg-white/60" />}
      {query.data && items.length === 0 && (
        <p className="mt-6 border-l-4 border-serenity py-1 pl-4 text-navy/70">
          {tab === 'pending' ? 'No applications waiting. New ones appear here as suppliers apply.' : `No ${tab} vendors.`}
        </p>
      )}

      {items.length > 0 && (
        <>
          {/* Cards under 768 px */}
          <ul className="mt-4 space-y-3 md:hidden">
            <AnimatePresence initial={false}>
            {items.map((v) => (
              <m.li key={v.id} layout="position" {...row} className="rounded-panel border border-serenity bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold">{v.shopName}</p>
                    <p className="text-sm text-navy/70">{v.user?.name}, <span className="part">{v.contactPhone}</span></p>
                  </div>
                  <Badge tone={vendorStatusTone[v.status]} className="capitalize">{v.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-navy/70">{v.businessAddress}</p>
                <p className="mt-1 text-xs text-navy/60">
                  Applied {new Date(v.createdAt).toLocaleDateString('en-GB')}
                  {v.tradeLicenseNo && <>, licence <span className="part">{v.tradeLicenseNo}</span></>}
                </p>
                <div className="mt-3">{renderActions(v)}</div>
              </m.li>
            ))}
            </AnimatePresence>
          </ul>

          {/* Table from 768 px */}
          <div className="mt-4 hidden overflow-hidden rounded-panel border border-serenity bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-serenity text-navy/70">
                <tr>
                  <th className="px-4 py-3 font-medium">Shop</th>
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="px-4 py-3 font-medium">Trade license</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-serenity/70">
                <AnimatePresence initial={false}>
                {items.map((v) => (
                  <m.tr key={v.id} layout="position" {...row} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{v.shopName}</p>
                      <p className="max-w-xs text-navy/60">{v.businessAddress}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{v.user?.name}</p>
                      <p className="text-navy/60">{v.user?.email ?? v.user?.phone}</p>
                    </td>
                    <td className="px-4 py-3">{v.tradeLicenseNo ? <span className="part">{v.tradeLicenseNo}</span> : '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(v.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3">
                      <Badge tone={vendorStatusTone[v.status]} className="capitalize">{v.status}</Badge>
                      {v.statusNote && <p className="mt-1 max-w-[12rem] text-xs text-navy/60">{v.statusNote}</p>}
                    </td>
                    <td className="px-4 py-3">{renderActions(v)}</td>
                  </m.tr>
                ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span>Page {page} of {pages}</span>
              <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}

      <Dialog
        open={pending !== null}
        onClose={() => setPending(null)}
        title={pending ? `${actionLabel[pending.action]} ${pending.vendor.shopName}?` : ''}
      >
        {pending && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate({ id: pending.vendor.id, action: pending.action, note: note.trim() || undefined });
            }}
          >
            {pending.action === 'approve' && (
              <p className="text-sm text-navy/70">The applicant becomes a vendor and can start listing products.</p>
            )}
            <label htmlFor="note" className="block text-sm font-medium">
              {pending.action === 'reject' ? 'Reason (shown to the applicant)' : 'Note (optional)'}
            </label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} required={pending.action === 'reject'} minLength={pending.action === 'reject' ? 3 : undefined} />
            {mutation.error && <Alert tone="error">{(mutation.error as Error).message}</Alert>}
            <div className="flex gap-2">
              <Button type="submit" variant={pending.action === 'approve' ? 'success' : 'danger'} loading={mutation.isPending}>
                {actionLabel[pending.action]}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setPending(null)}>Cancel</Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
