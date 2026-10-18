import { Suspense } from 'react';
import { RegisterForm } from '@/components/forms/RegisterForm';

export const metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <div className="page py-8 md:py-14">
      <div className="max-w-md">
        <h1 className="text-2xl md:text-3xl">Create an account</h1>
        <p className="mt-2 text-navy/75">Track orders, save addresses and check out faster.</p>
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
