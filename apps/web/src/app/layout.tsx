import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';

import { TRPCProvider } from '@/trpc/Provider';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maison — A household ledger',
  description:
    'Roommate bill splitting that feels like writing it down on the fridge. Split bills, settle up, stay friends.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#a23a2c',
          colorBackground: '#faf6ee',
          colorText: '#1a1814',
          fontFamily: 'var(--font-geist), ui-sans-serif, system-ui, sans-serif',
          borderRadius: '0.25rem',
        },
      }}
    >
      <html
        lang="en"
        className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
      >
        <body>
          <TRPCProvider>{children}</TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
