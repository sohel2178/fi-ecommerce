import { PageShell } from '@/components/PageShell';
import { VendorApplyForm } from '@/components/vendor/VendorApplyForm';

export const metadata = { title: 'Supply parts to Forbit' };

export default function VendorApplyPage() {
  return (
    <PageShell
      title="Supply parts to Forbit"
      description="Tell us about your business. We review every application before your shop can list parts."
    >
      <VendorApplyForm />
    </PageShell>
  );
}
