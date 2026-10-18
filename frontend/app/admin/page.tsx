import Link from 'next/link';
import { PageShell } from '@/components/PageShell';

export const metadata = { title: 'Admin' };

const sections = [
  { href: '/admin/vendors', title: 'Vendors', text: 'Approve, reject or suspend suppliers.' },
  { title: 'Categories and products', text: 'Catalogue, attributes and listing approval.' },
  { title: 'Pricing rules', text: 'Markup rules and price overrides.' },
  { title: 'Inventory', text: 'Stock across suppliers and adjustments.' },
  { title: 'Orders', text: 'Orders, payments and refunds.' },
  { title: 'Payouts', text: 'What Forbit owes each supplier.' },
  { title: 'Reports', text: 'Sales, margin, stock and Facebook campaigns.' },
];

export default function AdminHome() {
  return (
    <PageShell title="Admin">
      <ul className="max-w-3xl divide-y divide-serenity border-y border-serenity">
        {sections.map(({ href, title, text }) => (
          <li key={title}>
            {href ? (
              <Link href={href} className="group flex flex-col gap-0.5 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="font-semibold text-primary group-hover:underline sm:w-56">{title}</span>
                <span className="text-navy/75">{text}</span>
              </Link>
            ) : (
              <div className="flex flex-col gap-0.5 py-4 text-navy/65 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="font-semibold sm:w-56">{title}</span>
                <span>{text} Opens with the catalogue.</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
