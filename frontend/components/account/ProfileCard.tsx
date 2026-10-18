'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useFormError } from '@/lib/use-form-error';
import type { User } from '@/lib/types';
import { Card, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export function ProfileCard() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const err = useFormError();

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email ?? '', phone: user.phone ?? '' });
  }, [user]);

  if (!user) return <Card className="h-64 animate-pulse bg-white/60" />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    err.reset();
    setSaved(false);
    setLoading(true);
    try {
      const body = {
        name: form.name,
        ...(form.email ? { email: form.email } : {}),
        ...(form.phone ? { phone: form.phone } : {}),
      };
      const res = await api<{ user: User }>('/users/me', { method: 'PATCH', body });
      setUser(res.user);
      setSaved(true);
    } catch (e) {
      err.handle(e);
    } finally {
      setLoading(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <CardTitle>Profile</CardTitle>
        <Badge tone={user.role === 'admin' ? 'info' : user.role === 'vendor' ? 'teal' : 'neutral'} className="capitalize">
          {user.role}
        </Badge>
      </div>
      <form onSubmit={submit} className="mt-4 grid gap-4 md:grid-cols-2">
        <Alert tone="error" show={!!err.message} className="md:col-span-2">{err.message}</Alert>
        <Alert tone="success" show={saved} className="md:col-span-2">Profile saved.</Alert>
        <div className="md:col-span-2">
          <Field label="Full name" htmlFor="p-name" error={err.fields.name}>
            <Input id="p-name" value={form.name} onChange={set('name')} required />
          </Field>
        </div>
        <Field label="Email" htmlFor="p-email" error={err.fields.email} hint={user.email ? (user.emailVerified ? 'Verified' : 'Not verified') : undefined}>
          <Input id="p-email" type="email" value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Mobile number" htmlFor="p-phone" error={err.fields.phone} hint={user.phone ? (user.phoneVerified ? 'Verified' : 'Not verified') : undefined}>
          <Input id="p-phone" type="tel" value={form.phone} onChange={set('phone')} />
        </Field>
        <div className="md:col-span-2">
          <Button type="submit" loading={loading}>Save profile</Button>
        </div>
      </form>
    </Card>
  );
}
