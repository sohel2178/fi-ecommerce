import { PageShell } from '@/components/PageShell';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata = { title: 'Search' };

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  return (
    <PageShell title={q ? `Results for “${q}”` : 'Search'}>
      <EmptyState title="The catalogue opens soon" action={{ href: '/', label: 'Back to the parts cabinet' }}>
        {q ? (
          <p>
            We can&apos;t search for <span className="part font-medium text-navy">{q}</span> yet. Part search arrives with the first
            listings from our suppliers.
          </p>
        ) : (
          <p>Part search arrives with the first listings from our suppliers.</p>
        )}
      </EmptyState>
    </PageShell>
  );
}
