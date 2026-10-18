import { PageShell } from '@/components/PageShell';
import { VendorHome } from '@/components/vendor/VendorHome';

export const metadata = { title: 'Vendor' };

export default function VendorPage() {
  return (
    <PageShell title="Vendor dashboard">
      <VendorHome />
    </PageShell>
  );
}
