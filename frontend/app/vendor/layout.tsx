import { requireUser } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

/** Any logged-in user may open /vendor (to apply); vendor-only data is gated by the API. */
export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return children;
}
