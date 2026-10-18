import Link from 'next/link';

export function Footer() {
  return (
    // pb-16 keeps the footer clear of the fixed phone bottom nav.
    <footer className="bg-navy pb-16 text-serenity md:pb-0">
      <div className="page grid gap-8 py-10 text-sm md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-wide text-lg font-extrabold text-white">Forbit</p>
          <p className="mt-2 max-w-[40ch]">
            Cells, BMS boards, microcontrollers, ICs, passives and tools, delivered across Bangladesh.
          </p>
        </div>
        <nav aria-label="Shop" className="space-y-2">
          <p className="font-semibold text-white">Shop</p>
          <Link href="/categories" className="block hover:text-white">Parts cabinet</Link>
          <Link href="/track" className="block hover:text-white">Track an order</Link>
        </nav>
        <nav aria-label="Sell" className="space-y-2">
          <p className="font-semibold text-white">Sell</p>
          <Link href="/vendor/apply" className="block hover:text-white">Supply parts to Forbit</Link>
        </nav>
      </div>
      <div className="page">
        <p className="border-t border-white/10 py-4 text-xs">© {new Date().getFullYear()} Forbit. All prices include VAT.</p>
      </div>
    </footer>
  );
}
