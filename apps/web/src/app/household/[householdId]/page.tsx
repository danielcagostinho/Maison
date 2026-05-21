'use client';

import { UserButton } from '@clerk/nextjs';
import { formatMoney } from '@maison/shared';
import Link from 'next/link';
import { use, useState } from 'react';

import { trpc } from '@/trpc/client';

import { NewBillDialog } from './new-bill-dialog';

type PageProps = { params: Promise<{ householdId: string }> };

export default function HouseholdDetailPage({ params }: PageProps) {
  const { householdId } = use(params);

  const { data: me } = trpc.user.me.useQuery();
  const { data: household } = trpc.household.get.useQuery({ householdId });
  const { data: bills } = trpc.bill.list.useQuery({ householdId });
  const { data: payments } = trpc.payment.list.useQuery({ householdId });
  const { data: settlement } = trpc.settlement.forHousehold.useQuery({ householdId });

  const [newBillOpen, setNewBillOpen] = useState(false);

  const currency = household?.currency ?? 'CAD';
  const myNetCents = settlement?.balances.find((b) => b.user.id === me?.id)?.netCents ?? 0;
  const balanceLabel =
    myNetCents > 0 ? 'You’re owed' : myNetCents < 0 ? 'You owe' : 'All settled';

  // For readability, render the current user as "You" inline.
  const nameFor = (userId: string, fallback: string) =>
    userId === me?.id ? 'You' : fallback;

  return (
    <main className="min-h-screen bg-white">
      {/* ── Purple masthead ──────────────────────────────────── */}
      <header className="bg-primary text-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-7 px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-white"
            >
              <span aria-hidden>←</span>
              <span>Maison</span>
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: 'h-9 w-9 rounded-full' } }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-bold leading-tight sm:text-[34px]">
              {household?.name ?? '…'}
            </h1>
            <p className="text-[15px] text-white/70">
              {household ? (
                <>
                  {household.members.length} member
                  {household.members.length === 1 ? '' : 's'}
                  <span aria-hidden className="mx-2 text-white/40">·</span>
                  {currency}
                </>
              ) : (
                ' '
              )}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/60">
              {balanceLabel}
            </p>
            {myNetCents !== 0 && (
              <p className="text-[42px] font-bold tabular-nums leading-none">
                {formatMoney(Math.abs(myNetCents), currency)}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── White body ───────────────────────────────────────── */}
      <section className="mx-auto flex max-w-3xl flex-col gap-12 px-5 py-8 sm:px-8 sm:py-10">
        {/* Suggested settle-up */}
        {settlement && settlement.transfers.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Settle up
            </h2>
            <ul className="divide-y divide-line rounded-card border border-line bg-primary-faint/40">
              {settlement.transfers.map((t) => {
                const from = settlement.balances.find((b) => b.user.id === t.fromUserId)?.user;
                const to = settlement.balances.find((b) => b.user.id === t.toUserId)?.user;
                return (
                  <li
                    key={`${t.fromUserId}-${t.toUserId}`}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex items-baseline gap-3 text-[15px]">
                      <span className="font-bold text-text">
                        {nameFor(t.fromUserId, from?.name ?? '—')}
                      </span>
                      <span aria-hidden className="text-text-muted">→</span>
                      <span className="font-bold text-text">
                        {nameFor(t.toUserId, to?.name ?? '—')}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums text-text">
                      {formatMoney(t.amountCents, currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Members */}
        {household && (
          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Housemates
            </h2>
            <ul className="flex flex-wrap gap-2">
              {household.members.map((m) => {
                const balance =
                  settlement?.balances.find((b) => b.user.id === m.user.id)?.netCents ?? 0;
                return (
                  <li
                    key={m.userId}
                    className="flex items-center gap-3 rounded-full border border-line bg-primary-faint px-4 py-2"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[12px] font-bold text-primary">
                      {(m.user.name ?? '?').slice(0, 1).toUpperCase()}
                    </span>
                    <span className="text-[14px] font-bold text-text">
                      {nameFor(m.user.id, m.user.name)}
                    </span>
                    <span
                      className={
                        balance > 0
                          ? 'text-[13px] font-bold tabular-nums text-success'
                          : balance < 0
                            ? 'text-[13px] font-bold tabular-nums text-fail'
                            : 'text-[13px] font-bold tabular-nums text-text-muted'
                      }
                    >
                      {balance === 0 ? '—' : formatMoney(Math.abs(balance), currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Bills */}
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Bills
            </h2>
            <button
              type="button"
              onClick={() => setNewBillOpen(true)}
              disabled={!household || !me}
              className="text-[14px] font-bold text-primary transition-colors hover:opacity-80 disabled:opacity-40"
            >
              + New
            </button>
          </div>
          {bills && bills.length > 0 ? (
            <ul className="divide-y divide-line rounded-card border border-line">
              {bills.map((b) => (
                <li key={b.id} className="flex items-start justify-between gap-4 px-5 py-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-[16px] font-bold text-text">{b.title}</p>
                    <p className="text-[13px] text-text-muted">
                      Paid by <span className="font-bold">{nameFor(b.payerId, b.payer.name)}</span>
                      <span aria-hidden className="mx-1.5 text-text-muted/50">·</span>
                      {new Intl.DateTimeFormat('en-CA', {
                        day: 'numeric',
                        month: 'short',
                      }).format(new Date(b.occurredAt))}
                      {b.recurrence !== 'NONE' && (
                        <>
                          <span aria-hidden className="mx-1.5 text-text-muted/50">·</span>
                          <span className="font-bold uppercase tracking-wider text-primary-text-soft">
                            {b.recurrence.toLowerCase()}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 text-[16px] font-bold tabular-nums text-text">
                    {formatMoney(b.amountCents, currency)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[14px] text-text-muted">No bills yet.</p>
          )}
        </div>

        {/* Payments */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-muted">
            Payments
          </h2>
          {payments && payments.length > 0 ? (
            <ul className="divide-y divide-line rounded-card border border-line">
              {payments.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-4 px-5 py-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-[16px] font-bold text-text">
                      {nameFor(p.fromUserId, p.from.name)}{' '}
                      <span aria-hidden className="text-text-muted font-normal">→</span>{' '}
                      {nameFor(p.toUserId, p.to.name)}
                    </p>
                    <p className="text-[13px] text-text-muted">
                      {new Intl.DateTimeFormat('en-CA', {
                        day: 'numeric',
                        month: 'short',
                      }).format(new Date(p.occurredAt))}
                      {p.note && (
                        <>
                          <span aria-hidden className="mx-1.5 text-text-muted/50">·</span>
                          <span className="italic">{p.note}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 text-[16px] font-bold tabular-nums text-success">
                    {formatMoney(p.amountCents, currency)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[14px] text-text-muted">No payments yet.</p>
          )}
        </div>
      </section>

      {newBillOpen && household && me ? (
        <NewBillDialog
          household={household}
          defaultPayerId={me.id}
          onClose={() => setNewBillOpen(false)}
        />
      ) : null}
    </main>
  );
}
