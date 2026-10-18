import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Money comes from the API in poisha (integers). */
export function formatBdt(poisha: number): string {
  return `৳${(poisha / 100).toLocaleString('en-BD', { maximumFractionDigits: 2 })}`;
}
