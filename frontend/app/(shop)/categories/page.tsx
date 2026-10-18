import { PageShell } from '@/components/PageShell';
import { EmptyState } from '@/components/ui/empty-state';
import { CABINET } from '@/lib/cabinet';

export const metadata = { title: 'Categories' };

export default function CategoriesPage({ searchParams }: { searchParams: { c?: string } }) {
  const category = CABINET.find((c) => c.slug === searchParams.c);
  return (
    <PageShell title={category?.name ?? 'Categories'}>
      <EmptyState title="These drawers are still being stocked" action={{ href: '/vendor/apply', label: 'Supply parts to Forbit' }}>
        <p>
          {category ? (
            <>
              <span className="part text-navy">{category.parts}</span> and more will be listed here once suppliers add stock.
            </>
          ) : (
            'Categories fill up as suppliers add stock.'
          )}{' '}
          If you sell components, you can apply to list them.
        </p>
      </EmptyState>
    </PageShell>
  );
}
