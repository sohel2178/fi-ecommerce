import type { VendorStatus } from './types';

export const vendorStatusTone: Record<VendorStatus, 'warning' | 'success' | 'danger' | 'neutral'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  suspended: 'danger',
};
