import { PageShell } from '@/components/PageShell';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata = { title: 'Track an order' };

export default function TrackPage() {
  return (
    <PageShell title="Track an order">
      <EmptyState title="Order tracking opens with checkout" action={{ href: '/', label: 'Back to the parts cabinet' }}>
        <p>Once you place an order, enter its order number and your phone number here to see where it is.</p>
      </EmptyState>
    </PageShell>
  );
}
