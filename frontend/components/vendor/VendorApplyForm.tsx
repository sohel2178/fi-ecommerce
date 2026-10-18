'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, m } from 'framer-motion';
import { Upload } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { ease, reveal } from '@/lib/motion';
import { useFormError } from '@/lib/use-form-error';
import { Card, SectionTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

const PAYOUT_METHODS = [
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'rocket', label: 'Rocket' },
  { value: 'bank', label: 'Bank account' },
];

/** A check mark that draws itself once the upload is confirmed. */
function DrawnCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-success" aria-hidden>
      <m.circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease }} />
      <m.path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, delay: 0.3, ease }} />
    </svg>
  );
}

export function VendorApplyForm() {
  const user = useAuth((s) => s.user);
  const router = useRouter();
  const queryClient = useQueryClient();
  const err = useFormError();
  const [form, setForm] = useState({
    shopName: '',
    contactPhone: '',
    businessAddress: '',
    tradeLicenseNo: '',
    method: 'bkash',
    accountName: '',
    accountNumber: '',
    bankName: '',
    branch: '',
  });
  const [license, setLicense] = useState<{ publicId: string; name: string } | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    err.reset();
    setLicense(null);
    setProgress(0);
    try {
      const { publicId } = await uploadToCloudinary('trade-license', file, setProgress);
      setLicense({ publicId, name: file.name });
    } catch (e) {
      err.handle(e);
    } finally {
      setProgress(null);
      input.value = '';
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    err.reset();
    if (!license) {
      err.fail('Upload your trade license before sending the application.');
      return;
    }
    setSubmitting(true);
    try {
      await api('/vendor/apply', {
        method: 'POST',
        body: {
          shopName: form.shopName,
          contactPhone: form.contactPhone,
          businessAddress: form.businessAddress,
          ...(form.tradeLicenseNo ? { tradeLicenseNo: form.tradeLicenseNo } : {}),
          tradeLicensePublicId: license.publicId,
          payout: {
            method: form.method,
            accountName: form.accountName,
            accountNumber: form.accountNumber,
            ...(form.method === 'bank' ? { bankName: form.bankName, branch: form.branch || undefined } : {}),
          },
        },
      });
      await queryClient.invalidateQueries({ queryKey: ['vendor', 'me'] });
      router.push('/vendor');
    } catch (e) {
      err.handle(e);
    } finally {
      setSubmitting(false);
    }
  }

  if (user && user.role !== 'customer') {
    return <Alert>Your account is already a {user.role} account, so it can&apos;t apply as a supplier.</Alert>;
  }

  return (
    <Card className="max-w-3xl">
      <form onSubmit={submit} className="space-y-8">
        <Alert tone="error" show={!!err.message}>{err.message}</Alert>

        <fieldset className="space-y-4">
          <SectionTitle as="legend">Your business</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Shop name" htmlFor="v-shop" error={err.fields.shopName}>
              <Input id="v-shop" required minLength={3} value={form.shopName} onChange={set('shopName')} />
            </Field>
            <Field label="Contact phone" htmlFor="v-phone" error={err.fields.contactPhone}>
              <Input id="v-phone" type="tel" required value={form.contactPhone} onChange={set('contactPhone')} />
            </Field>
          </div>
          <Field label="Business address" htmlFor="v-addr" error={err.fields.businessAddress}>
            <Textarea id="v-addr" required minLength={10} value={form.businessAddress} onChange={set('businessAddress')} />
          </Field>
          <Field label="Trade license number" htmlFor="v-tl" error={err.fields.tradeLicenseNo}>
            <Input id="v-tl" value={form.tradeLicenseNo} onChange={set('tradeLicenseNo')} className="part" />
          </Field>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Trade license document</p>
            <label
              htmlFor="v-file"
              className="flex cursor-pointer items-center gap-3 rounded-control border-2 border-dashed border-navy/25 bg-mist p-4 text-sm hover:border-primary"
            >
              {license ? <DrawnCheck /> : <Upload className="h-6 w-6 shrink-0 text-primary" aria-hidden />}
              <span className="min-w-0">
                <span className="block break-all font-semibold">{license ? license.name : 'Choose a PDF, JPG or PNG'}</span>
                <span className="block text-navy/65">
                  {license ? 'Uploaded. Choose another file to replace it.' : 'Up to 5 MB. Only Forbit staff can see this file.'}
                </span>
              </span>
            </label>
            <input id="v-file" type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={onFile} disabled={progress !== null} />
            <AnimatePresence>
              {progress !== null && (
                <m.div {...reveal} className="overflow-hidden">
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-serenity" role="progressbar" aria-label="Upload progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                    <m.div className="h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.2, ease }} />
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <SectionTitle as="legend">Payouts</SectionTitle>
          <p className="text-sm text-navy/70">Where Forbit sends your money for delivered orders.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Method" htmlFor="v-method">
              <Select id="v-method" value={form.method} onChange={set('method')}>
                {PAYOUT_METHODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </Select>
            </Field>
            <Field label="Account name" htmlFor="v-acname" error={err.fields.payout}>
              <Input id="v-acname" required value={form.accountName} onChange={set('accountName')} />
            </Field>
            <Field label={form.method === 'bank' ? 'Account number' : 'Wallet number'} htmlFor="v-acno">
              <Input id="v-acno" required inputMode="numeric" value={form.accountNumber} onChange={set('accountNumber')} className="part" />
            </Field>
          </div>
          <AnimatePresence initial={false}>
            {form.method === 'bank' && (
              <m.div {...reveal} className="overflow-hidden">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Bank name" htmlFor="v-bank"><Input id="v-bank" required value={form.bankName} onChange={set('bankName')} /></Field>
                  <Field label="Branch" htmlFor="v-branch"><Input id="v-branch" value={form.branch} onChange={set('branch')} /></Field>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </fieldset>

        <Button type="submit" size="lg" className="w-full md:w-auto" loading={submitting} disabled={progress !== null}>
          Send application
        </Button>
      </form>
    </Card>
  );
}
