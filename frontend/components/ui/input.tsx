import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const field =
  'w-full rounded-control border border-navy/20 bg-white px-3 text-base text-navy placeholder:text-navy/40 hover:border-navy/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:opacity-60 aria-[invalid=true]:border-danger';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(field, 'h-11', className)} {...props} />
));
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => <textarea ref={ref} className={cn(field, 'min-h-24 py-2', className)} {...props} />,
);
Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => <select ref={ref} className={cn(field, 'h-11', className)} {...props} />,
);
Select.displayName = 'Select';
