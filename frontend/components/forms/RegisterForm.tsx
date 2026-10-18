'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { getAttribution } from '@/lib/attribution';
import { track } from '@/lib/meta';
import { safeNext, useFormError } from '@/lib/use-form-error';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { Alert } from '@/components/ui/alert';

export function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const err = useFormError();
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const setSession = useAuth((s) => s.setSession);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    err.reset();
    setLoading(true);
    try {
      const body = {
        name: form.name,
        password: form.password,
        ...(form.email ? { email: form.email } : {}),
        ...(form.phone ? { phone: form.phone } : {}),
        attribution: getAttribution(),
      };
      const res = await api<{ accessToken: string; user: User }>('/auth/register', { method: 'POST', body, auth: false });
      setSession(res.accessToken, res.user);
      track('CompleteRegistration');
      router.replace(next);
      router.refresh();
    } catch (e) {
      err.handle(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-panel border border-serenity bg-white p-4 md:p-6">
        <Alert tone="error" show={!!err.message}>{err.message}</Alert>
        <Field label="Full name" htmlFor="name" error={err.fields.name}>
          <Input id="name" autoComplete="name" required value={form.name} onChange={set('name')} />
        </Field>
        <Field label="Email" htmlFor="email" error={err.fields.email}>
          <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Mobile number" htmlFor="phone" error={err.fields.phone} hint="Add an email, a phone number, or both">
          <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} />
        </Field>
        <Field label="Password" htmlFor="password" error={err.fields.password} hint="At least 8 characters">
          <Input id="password" type="password" autoComplete="new-password" minLength={8} required value={form.password} onChange={set('password')} />
        </Field>
        <Button type="submit" block loading={loading}>
          Create account
        </Button>
      </form>
      <p className="mt-5 text-sm text-navy/75">
        Already have an account?{' '}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
