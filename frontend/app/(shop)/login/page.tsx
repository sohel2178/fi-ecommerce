import { Suspense } from 'react';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <div className="page py-8 md:py-14">
      <div className="max-w-md">
        <h1 className="text-2xl md:text-3xl">Log in</h1>
        <p className="mt-2 text-navy/75">Use your password, or get a code by SMS.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
