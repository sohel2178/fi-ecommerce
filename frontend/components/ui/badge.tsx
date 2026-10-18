import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badge = cva('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    tone: {
      neutral: 'bg-serenity text-navy',
      info: 'bg-primary/10 text-primary-dark',
      success: 'bg-success/10 text-[#11793a]',
      warning: 'bg-warning/20 text-navy',
      danger: 'bg-danger/10 text-[#a61b1b]',
      teal: 'bg-teal-accent/10 text-[#057575]',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

/** Status pill. The dot repeats the colour so status never relies on text colour alone. */
export function Badge({ className, tone, children, ...props }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badge>) {
  return (
    <span className={cn(badge({ tone }), className)} {...props}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}
