import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonVariants } from './button-variants';

/** An empty screen gives the next step, not a mood. */
export function EmptyState({ title, children, action }: { title: string; children: ReactNode; action?: { href: string; label: string } }) {
  return (
    <div className="max-w-xl border-l-4 border-serenity py-2 pl-5">
      <h2 className="text-xl">{title}</h2>
      <div className="mt-2 text-navy/75">{children}</div>
      {action && (
        <Link href={action.href} className={buttonVariants({ variant: 'outline', className: 'mt-5' })}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
