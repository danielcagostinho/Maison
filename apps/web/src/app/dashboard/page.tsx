'use client';

import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';

import { trpc } from '@/trpc/client';

import { CreateHouseholdDialog } from './CreateHouseholdDialog';

export default function DashboardPage() {
  const { data: me } = trpc.user.me.useQuery();
  const { data: households, isLoading } = trpc.household.list.useQuery();

  const [dialogOpen, setDialogOpen] = useState(false);

  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <main className="relative min-h-screen text-ink">
      {/* Vertical hairline binding, matched to landing. */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-[max(2rem,calc(50%-32rem))] top-0 bottom-0 hidden w-px bg-rule/40 md:block"
      />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 md:px-10 md:py-10">
        {/* ── Masthead ─────────────────────────────────────────── */}
        <header className="reveal-fade">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              Maison<span className="text-stamp">.</span>
            </h1>
            <UserButton
              appearance={{ elements: { avatarBox: 'h-9 w-9 rounded-full' } }}
            />
          </div>
          <div className="reveal-rule mt-3 h-px origin-left bg-rule" />
          <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 smallcaps text-ink-4">
            <span>
              {me?.name ?? '—'}
              <span aria-hidden className="mx-2 text-ink-5">
                ·
              </span>
              <span className="text-ink-4/80">{me?.email ?? ''}</span>
            </span>
            <span className="font-mono">{today}</span>
          </div>
        </header>

        {/* ── Body ─────────────────────────────────────────────── */}
        <section className="flex flex-1 flex-col py-14 md:py-20">
          {isLoading ? (
            <LoadingState />
          ) : households && households.length > 0 ? (
            <HouseholdList
              households={households}
              onCreateClick={() => setDialogOpen(true)}
            />
          ) : (
            <EmptyState onCreateClick={() => setDialogOpen(true)} />
          )}
        </section>

        {/* ── Footer / colophon ────────────────────────────────── */}
        <footer className="reveal-fade flex items-end justify-between gap-4 border-t border-rule/60 pt-6">
          <p className="smallcaps text-ink-4">Household ledger</p>
          <p className="smallcaps font-mono text-ink-4">v0.1</p>
        </footer>
      </div>

      {dialogOpen ? (
        <CreateHouseholdDialog onClose={() => setDialogOpen(false)} />
      ) : null}
    </main>
  );
}

function LoadingState() {
  return (
    <div className="reveal-fade">
      <p className="smallcaps text-ink-4">Loading the ledger…</p>
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="grid gap-10 md:grid-cols-12">
      <div className="reveal md:col-span-7">
        <p className="smallcaps text-ink-4">No house yet</p>
        <h2 className="mt-4 font-display text-5xl font-medium leading-tight tracking-tight md:text-6xl">
          It&apos;s quiet
          <br />
          in here.
        </h2>
        <p
          className="reveal mt-6 max-w-md font-display text-xl italic leading-snug text-ink-2"
          style={{ animationDelay: '0.15s' }}
        >
          Open a house to start logging rent, groceries, and the rest. Invite
          your housemates after.
        </p>
      </div>

      <div
        className="reveal flex flex-col gap-4 md:col-span-5 md:items-end md:justify-end"
        style={{ animationDelay: '0.3s' }}
      >
        <button
          type="button"
          onClick={onCreateClick}
          className="group inline-flex items-center gap-3 rounded-sm bg-stamp px-7 py-3.5 text-paper-soft transition-all hover:bg-stamp-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-stamp-soft focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.32em]">
            Open a house
          </span>
          <span
            aria-hidden
            className="text-base leading-none transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </button>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ink-4">
          Takes about ten seconds
        </p>
      </div>
    </div>
  );
}

function HouseholdList({
  households,
  onCreateClick,
}: {
  households: Array<{ id: string; name: string; currency: string; createdAt: Date }>;
  onCreateClick: () => void;
}) {
  return (
    <div>
      <div className="reveal flex items-baseline justify-between gap-4">
        <p className="smallcaps text-ink-4">Your houses</p>
        <button
          type="button"
          onClick={onCreateClick}
          className="smallcaps text-ink-3 underline decoration-rule decoration-dotted underline-offset-4 transition-colors hover:text-stamp"
        >
          + Open another
        </button>
      </div>

      <ul className="reveal mt-6 divide-y divide-rule/60 border-y border-rule/60">
        {households.map((h, i) => (
          <li
            key={h.id}
            className="reveal group flex items-baseline justify-between gap-6 py-5"
            style={{ animationDelay: `${0.15 + i * 0.06}s` }}
          >
            <div className="min-w-0">
              <p className="font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-stamp">
                {h.name}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-ink-4">
                {h.currency}
                <span aria-hidden className="mx-2 text-ink-5">
                  ·
                </span>
                opened {formatOpened(h.createdAt)}
              </p>
            </div>
            <span
              aria-hidden
              className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-ink-4 transition-all group-hover:translate-x-0.5 group-hover:text-stamp"
            >
              Open →
            </span>
          </li>
        ))}
      </ul>

      {/* Stub for what's coming. */}
      <div className="reveal mt-14 grid gap-8 md:grid-cols-2" style={{ animationDelay: '0.4s' }}>
        <ComingSoonCard
          label="Balances"
          line="Net positions across the house, rebalanced after every receipt."
        />
        <ComingSoonCard
          label="Recent activity"
          line="Bills logged, settlements paid, splits adjusted — in order."
        />
      </div>
    </div>
  );
}

function ComingSoonCard({ label, line }: { label: string; line: string }) {
  return (
    <div className="border border-rule/70 bg-paper-soft/60 p-5">
      <div className="flex items-baseline justify-between">
        <p className="smallcaps text-ink-4">{label}</p>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.32em] text-ink-5">
          Soon
        </p>
      </div>
      <p className="mt-3 font-display text-lg italic leading-snug text-ink-3">
        {line}
      </p>
    </div>
  );
}

function formatOpened(d: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(d));
}
