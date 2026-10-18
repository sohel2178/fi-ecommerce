'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { getAttribution } from '@/lib/attribution';
import { quick, reveal } from '@/lib/motion';
import { safeNext, useFormError } from '@/lib/use-form-error';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { Alert } from '@/components/ui/alert';
import { Tabs } from '@/components/ui/tabs';

type Session = { accessToken: string; user: User };
type Mode = 'password' | 'otp';

const swap = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0, transition: quick },
  exit: { opacity: 0, x: -16, transition: quick },
};

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('password');
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const setSession = useAuth((s) => s.setSession);

  function done(session: Session) {
    setSession(session.accessToken, session.user);
    router.replace(next);
    router.refresh();
  }

  return (
    <div className="mt-6">
      <Tabs
        id="login-mode"
        label="How to log in"
        value={mode}
        onChange={setMode}
        items={[
          { value: 'password', label: 'Password' },
          { value: 'otp', label: 'SMS code' },
        ]}
      />
      <div className="mt-4 overflow-hidden rounded-panel border border-serenity bg-white p-4 md:p-6">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={mode} {...swap}>
            {mode === 'password' ? <PasswordLogin onDone={done} /> : <OtpLogin onDone={done} />}
          </m.div>
        </AnimatePresence>
      </div>
      <p className="mt-5 text-sm text-navy/75">
        New to Forbit?{' '}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function PasswordLogin({ onDone }: { onDone: (s: Session) => void }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const err = useFormError();

  async function submit(e: FormEvent) {
    e.preventDefault();
    err.reset();
    setLoading(true);
    try {
      onDone(await api<Session>('/auth/login', { method: 'POST', body: { identifier, password }, auth: false }));
    } catch (e) {
      err.handle(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Alert tone="error" show={!!err.message}>{err.message}</Alert>
      <Field label="Email or phone number" htmlFor="identifier" error={err.fields.identifier}>
        <Input id="identifier" autoComplete="username" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
      </Field>
      <Field label="Password" htmlFor="password" error={err.fields.password}>
        <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <Button type="submit" block loading={loading}>
        Log in
      </Button>
    </form>
  );
}

function OtpLogin({ onDone }: { onDone: (s: Session) => void }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [needsName, setNeedsName] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const err = useFormError();

  async function sendCode(e?: FormEvent) {
    e?.preventDefault();
    err.reset();
    setLoading(true);
    try {
      const res = await api<{ devCode?: string }>('/auth/otp/send', { method: 'POST', body: { phone }, auth: false });
      setDevCode(res.devCode ?? null);
      setStep('code');
    } catch (e) {
      err.handle(e);
    } finally {
      setLoading(false);
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    err.reset();
    setLoading(true);
    try {
      const body = { phone, code, ...(needsName ? { name, attribution: getAttribution() } : {}) };
      onDone(await api<Session>('/auth/otp/verify', { method: 'POST', body, auth: false }));
    } catch (e) {
      if (e instanceof ApiError && e.code === 'ACCOUNT_NOT_FOUND') {
        // The code is still valid; ask for a name and submit it again to sign up.
        setNeedsName(true);
        err.reset();
        return;
      }
      err.handle(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === 'phone' ? (
        <m.form key="phone" {...swap} onSubmit={sendCode} className="space-y-4">
          <Alert tone="error" show={!!err.message}>{err.message}</Alert>
          <Field label="Mobile number" htmlFor="phone" error={err.fields.phone} hint="We'll text you a 6-digit code, e.g. to 01712345678">
            <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Button type="submit" block loading={loading}>
            Send code
          </Button>
        </m.form>
      ) : (
        <m.form key="code" {...swap} onSubmit={verify} className="space-y-4">
          <Alert tone="error" show={!!err.message}>{err.message}</Alert>
          <Alert tone="warning" show={!!devCode}>Development mode: your code is <span className="part font-semibold">{devCode}</span></Alert>
          <Alert show={needsName}>No account uses this number yet. Add your name to create one.</Alert>
          <Field label={`Code sent to ${phone}`} htmlFor="code" error={err.fields.code}>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="part text-lg tracking-[0.3em]"
            />
          </Field>
          <AnimatePresence initial={false}>
            {needsName && (
              <m.div {...reveal} className="overflow-hidden">
                <Field label="Your name" htmlFor="name" error={err.fields.name}>
                  <Input id="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
              </m.div>
            )}
          </AnimatePresence>
          <Button type="submit" block loading={loading}>
            {needsName ? 'Create account' : 'Log in'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            block
            onClick={() => {
              setStep('phone');
              setNeedsName(false);
              setCode('');
              err.reset();
            }}
          >
            Use a different number
          </Button>
        </m.form>
      )}
    </AnimatePresence>
  );
}
