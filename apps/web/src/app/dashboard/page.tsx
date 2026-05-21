'use client';

import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';

import { trpc } from '@/trpc/client';

import { CreateHouseholdDialog } from './CreateHouseholdDialog';

export default function DashboardPage() {
  const { data: me } = trpc.user.me.useQuery();
  const { data: households, isLoading } = trpc.household.list.useQuery();

  const [dialogOpen, setDialogOpen] = useState(false);

  const firstName = me?.name?.split(' ')[0];

  return (
    <main className="min-h-screen bg-white">
      {/* ─── Purple header ────────────────────────────────────── */}
      <header className="reveal-fade bg-primary text-white">
        <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/60">
              Maison
            </p>
            <UserButton
              appearance={{ elements: { avatarBox: 'h-9 w-9 rounded-full' } }}
            />
          </div>

          <div className="mt-6 sm:mt-8">
            <h1 className="text-[28px] font-bold leading-tight sm:text-[34px]">
              {firstName ? `Hey, ${firstName}.` : 'Hey there.'}
            </h1>
            {households && households.length > 0 ? (
              <p className="mt-1 text-[15px] text-white/70">
                Welcome back. Everything&apos;s up to date.
              </p>
            ) : (
              <p className="mt-1 text-[15px] text-white/70">
                Let&apos;s get your first house set up.
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ─── White body ──────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
        {isLoading ? (
          <p className="text-[15px] text-text-muted">Loading…</p>
        ) : households && households.length > 0 ? (
          <HouseholdGrid
            households={households}
            onCreateClick={() => setDialogOpen(true)}
          />
        ) : (
          <EmptyState onCreateClick={() => setDialogOpen(true)} />
        )}
      </section>

      {dialogOpen ? (
        <CreateHouseholdDialog onClose={() => setDialogOpen(false)} />
      ) : null}
    </main>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="reveal flex flex-col items-center py-10 text-center sm:py-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-faint">
        <HouseIcon className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mt-6 max-w-sm text-[22px] font-bold leading-snug text-text">
        Open your first house to start splitting.
      </h2>
      <p className="mt-2 max-w-sm text-[15px] text-text-muted">
        Add the address or a nickname, then invite your housemates. Bills
        come next.
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="mt-7 flex h-[50px] items-center justify-center rounded-button bg-primary px-7 text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Open a house
      </button>
    </div>
  );
}

function HouseholdGrid({
  households,
  onCreateClick,
}: {
  households: Array<{ id: string; name: string; currency: string; createdAt: Date }>;
  onCreateClick: () => void;
}) {
  return (
    <div className="reveal">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-muted">
          Your houses
        </h2>
        <button
          type="button"
          onClick={onCreateClick}
          className="text-[14px] font-bold text-primary transition-colors hover:opacity-80"
        >
          + New
        </button>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {households.map((h, i) => (
          <li
            key={h.id}
            className="reveal group cursor-pointer rounded-card border border-line bg-primary-faint p-5 transition-all hover:border-primary-soft hover:shadow-sm"
            style={{ animationDelay: `${0.1 + i * 0.05}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <HouseIcon className="h-5 w-5 text-primary" />
              </div>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-primary-text-soft">
                {h.currency}
              </span>
            </div>
            <p className="mt-4 text-[18px] font-bold text-text">{h.name}</p>
            <p className="mt-1 text-[13px] text-text-muted">
              Opened {formatOpened(h.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HouseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}

function formatOpened(d: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(d));
}
