import type { ReactNode } from 'react';

export function PageShell({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="page py-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl">{title}</h1>
          {description && <p className="mt-2 max-w-[60ch] text-navy/75">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
