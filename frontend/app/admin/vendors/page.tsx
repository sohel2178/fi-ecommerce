import { PageShell } from '@/components/PageShell';
import { VendorQueue } from '@/components/admin/VendorQueue';

export const metadata = { title: 'Vendors · Admin' };

export default function AdminVendorsPage() {
  return (
    <PageShell title="Vendors" description="Review supplier applications and manage vendor access.">
      <VendorQueue />
    </PageShell>
  );
}
