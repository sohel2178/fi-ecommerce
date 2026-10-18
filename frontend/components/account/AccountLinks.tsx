'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Package, ShieldCheck, Store } from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { logout } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AccountLinks() {
  const user = useAuth((s) => s.user);
  const router = useRouter();

  const link = 'flex items-center gap-3 rounded-control px-3 py-3 text-sm font-medium hover:bg-mist';
  return (
    <Card className="h-fit space-y-0.5 p-1.5 md:p-1.5">
      <div className={`${link} cursor-default opacity-60 hover:bg-transparent`} aria-disabled>
        <Package className="h-5 w-5 text-primary" /> My orders <span className="ml-auto text-xs">Coming soon</span>
      </div>
      {user?.role === 'admin' ? (
        <Link href="/admin" className={link}>
          <ShieldCheck className="h-5 w-5 text-primary" /> Admin panel
        </Link>
      ) : (
        <Link href="/vendor" className={link}>
          <Store className="h-5 w-5 text-primary" /> {user?.role === 'vendor' ? 'Vendor dashboard' : 'Supply parts to Forbit'}
        </Link>
      )}
      <Button
        variant="ghost"
        block
        className="justify-start gap-3 px-3 text-danger"
        onClick={async () => {
          await logout();
          router.replace('/');
          router.refresh();
        }}
      >
        <LogOut className="h-5 w-5" /> Log out
      </Button>
    </Card>
  );
}
