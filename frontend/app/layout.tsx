import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { SITE_URL } from '@/lib/config';

// Archivo's width axis carries the display voice (expanded headlines); Plex Mono is for part numbers only.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Forbit — Electronic components & tools', template: '%s | Forbit' },
  description: 'Batteries, BMS boards, microcontrollers, ICs, resistors, capacitors and electric tools in Bangladesh.',
  openGraph: { siteName: 'Forbit', type: 'website', locale: 'en_BD' },
};

export const viewport: Viewport = { themeColor: '#005A91', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${plexMono.variable} flex min-h-screen flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BottomNav />
        </Providers>
        <MetaPixel />
      </body>
    </html>
  );
}
