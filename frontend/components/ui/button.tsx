'use client';

import { forwardRef, type ReactNode } from 'react';
import { m, type HTMLMotionProps } from 'framer-motion';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from './button-variants';
import { cn } from '@/lib/utils';

export type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> &
  VariantProps<typeof buttonVariants> & { loading?: boolean; children?: ReactNode };

const pressable = new Set(['primary', 'success', 'danger']);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size, block, loading, disabled, children, ...props }, ref) => (
    <m.button
      ref={ref}
      whileTap={pressable.has(variant ?? 'primary') ? { scale: 0.97 } : undefined}
      className={cn(buttonVariants({ variant, size, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />}
      {children}
    </m.button>
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
