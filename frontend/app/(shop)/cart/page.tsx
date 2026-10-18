import { PageShell } from '@/components/PageShell';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata = { title: 'Cart' };

export default function CartPage() {
  return (
    <PageShell title="Cart">
      <EmptyState title="Your cart is empty" action={{ href: '/', label: 'Browse the parts cabinet' }}>
        <p>Parts you add will appear here with their price, including VAT.</p>
      </EmptyState>
    </PageShell>
  );
}
