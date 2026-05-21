import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { TRPCProvider } from '@/trpc/provider';

// Product Sans, pulled verbatim from the legacy Maison app.
const productSans = localFont({
  src: [
    { path: '../fonts/ProductSansRegular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/ProductSansItalic.ttf', weight: '400', style: 'italic' },
    { path: '../fonts/ProductSansBold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/ProductSansBoldItalic.ttf', weight: '700', style: 'italic' },
  ],
  variable: '--font-product-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maison — Housemate Sharing Made Easier',
  description: 'Split bills, settle up, stay friends.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#4900a7',
          colorBackground: '#ffffff',
          colorText: '#1f1135',
          fontFamily: 'var(--font-product-sans), ui-sans-serif, system-ui, sans-serif',
          borderRadius: '12px',
        },
      }}
    >
      <html lang="en" className={productSans.variable}>
        <body>
          <TRPCProvider>{children}</TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
