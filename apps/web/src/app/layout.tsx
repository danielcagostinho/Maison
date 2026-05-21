import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

import { TRPCProvider } from '@/trpc/Provider';

export const metadata: Metadata = {
  title: 'Maison — Roommate Bill Splitting',
  description: 'Split bills, settle up, stay friends.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <TRPCProvider>{children}</TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
