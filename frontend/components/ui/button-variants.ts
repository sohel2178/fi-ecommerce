import { cva } from 'class-variance-authority';

/** Plain (server-safe) class builder, so server components can style links as buttons. */
export const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 rounded-control font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-serenity text-navy hover:bg-[#a3c3de]',
        outline: 'border border-navy/25 bg-white text-navy hover:border-navy/60',
        ghost: 'text-navy hover:bg-serenity/50',
        danger: 'bg-danger text-white hover:bg-[#c11f1f]',
        success: 'bg-success text-white hover:bg-[#13893e]',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-12 px-6 text-base',
      },
      block: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);
