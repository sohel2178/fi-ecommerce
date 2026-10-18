'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { quick, reveal } from '@/lib/motion';
import { useFormError } from '@/lib/use-form-error';
import type { Address } from '@/lib/types';
import { Card, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const empty = { label: '', recipientName: '', phone: '', line1: '', line2: '', area: '', city: '', district: '', postcode: '' };

export function AddressBook() {
  const { user, setUser } = useAuth();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState<string | null>(null);
  const err = useFormError();

  if (!user) return null;

  function apply(addresses: Address[]) {
    setUser({ ...user!, addresses });
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    err.reset();
    setBusy('add');
    try {
      const body = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''));
      apply((await api<{ addresses: Address[] }>('/users/me/addresses', { method: 'POST', body })).addresses);
      setForm(empty);
      setAdding(false);
    } catch (e) {
      err.handle(e);
    } finally {
      setBusy(null);
    }
  }

  async function makeDefault(a: Address) {
    setBusy(a._id);
    const { _id, ...rest } = a;
    try {
      apply((await api<{ addresses: Address[] }>(`/users/me/addresses/${_id}`, { method: 'PUT', body: { ...rest, isDefault: true } })).addresses);
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    setBusy(id);
    try {
      apply((await api<{ addresses: Address[] }>(`/users/me/addresses/${id}`, { method: 'DELETE' })).addresses);
    } finally {
      setBusy(null);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <CardTitle>Delivery addresses</CardTitle>
        {!adding && (
          <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>
            Add address
          </Button>
        )}
      </div>

      {user.addresses.length === 0 && !adding && (
        <p className="mt-3 text-sm text-navy/70">Add an address now and checkout will fill it in for you.</p>
      )}

      <m.ul layout className={`grid gap-3 md:grid-cols-2 ${user.addresses.length ? 'mt-4' : ''}`}>
        <AnimatePresence initial={false}>
          {user.addresses.map((a) => (
            <m.li
              key={a._id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97, transition: quick }}
              className={`rounded-control border bg-white p-3 text-sm ${a.isDefault ? 'border-navy/40' : 'border-serenity'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{a.label || 'Address'}</p>
                {a.isDefault && <Badge tone="teal">Default</Badge>}
              </div>
              <p className="mt-1">
                {a.recipientName}, <span className="part">{a.phone}</span>
              </p>
              <p className="text-navy/70">{[a.line1, a.line2, a.area, a.city, a.district, a.postcode].filter(Boolean).join(', ')}</p>
              <div className="mt-3 flex gap-2">
                {!a.isDefault && (
                  <Button size="sm" variant="outline" loading={busy === a._id} onClick={() => makeDefault(a)}>
                    Make default
                  </Button>
                )}
                <Button size="sm" variant="ghost" aria-label={`Delete ${a.label || 'address'}`} onClick={() => remove(a._id)} disabled={busy === a._id}>
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>

      <AnimatePresence initial={false}>
        {adding && (
          <m.form key="add" {...reveal} onSubmit={add} className="overflow-hidden">
            <div className="mt-4 grid gap-4 border-t border-serenity pt-4 md:grid-cols-2">
              <Alert tone="error" show={!!err.message} className="md:col-span-2">{err.message}</Alert>
              <Field label="Label" htmlFor="a-label" hint="Home, office, workshop"><Input id="a-label" value={form.label} onChange={set('label')} /></Field>
              <Field label="Recipient name" htmlFor="a-name" error={err.fields.recipientName}><Input id="a-name" required value={form.recipientName} onChange={set('recipientName')} /></Field>
              <Field label="Phone" htmlFor="a-phone" error={err.fields.phone}><Input id="a-phone" type="tel" required value={form.phone} onChange={set('phone')} /></Field>
              <Field label="House, road" htmlFor="a-line1" error={err.fields.line1}><Input id="a-line1" required value={form.line1} onChange={set('line1')} /></Field>
              <Field label="Area" htmlFor="a-area"><Input id="a-area" value={form.area} onChange={set('area')} /></Field>
              <Field label="City" htmlFor="a-city" error={err.fields.city}><Input id="a-city" required value={form.city} onChange={set('city')} /></Field>
              <Field label="District" htmlFor="a-district" error={err.fields.district}><Input id="a-district" required value={form.district} onChange={set('district')} /></Field>
              <Field label="Postcode" htmlFor="a-post"><Input id="a-post" inputMode="numeric" value={form.postcode} onChange={set('postcode')} /></Field>
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" loading={busy === 'add'}>Save address</Button>
                <Button type="button" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
              </div>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </Card>
  );
}
