import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/** A panel: white, 1 px serenity border, no shadow. Shadows are reserved for the pulled cabinet drawer. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-panel border border-serenity bg-white p-4 md:p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg', className)} {...props} />;
}

/** Heading that separates field groups inside one panel. */
export function SectionTitle({ className, as: Tag = 'h3', ...props }: HTMLAttributes<HTMLHeadingElement> & { as?: ElementType }) {
  return <Tag className={cn('w-full border-b border-serenity pb-2 font-expanded text-base font-bold', className)} {...props} />;
}
