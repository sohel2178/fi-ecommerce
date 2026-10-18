import { HeroSearch } from '@/components/home/HeroSearch';
import { PartsCabinet } from '@/components/home/PartsCabinet';

const promises = [
  { title: 'Cash on delivery', text: 'Pay when the parcel reaches you, or pay online at checkout.' },
  { title: 'Prices include VAT', text: 'VAT is already in every price you see. Delivery is added at checkout.' },
  { title: 'Sold and shipped by Forbit', text: 'One price per part, one order, one parcel to track.' },
];

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <PartsCabinet />
      <section className="page py-10 md:py-14" aria-label="How buying works">
        <ul className="grid gap-6 border-t border-serenity pt-6 md:grid-cols-3">
          {promises.map((p) => (
            <li key={p.title}>
              <p className="font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-navy/70">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
