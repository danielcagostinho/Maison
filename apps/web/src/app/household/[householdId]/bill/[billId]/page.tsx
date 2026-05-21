'use client';

import { UserButton } from '@clerk/nextjs';
import { formatMoney } from '@maison/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

import { trpc } from '@/trpc/client';

type PageProps = { params: Promise<{ householdId: string; billId: string }> };

export default function BillDetailPage({ params }: PageProps) {
  const { householdId, billId } = use(params);
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: me } = trpc.user.me.useQuery();
  const { data: bill, isLoading } = trpc.bill.get.useQuery({ householdId, billId });
  const { data: household } = trpc.household.get.useQuery({ householdId });

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const deleteBill = trpc.bill.delete.useMutation({
    onSuccess: () => {
      utils.bill.list.invalidate({ householdId });
      utils.settlement.forHousehold.invalidate({ householdId });
      router.replace(`/household/${householdId}`);
    },
  });

  const currency = household?.currency ?? 'CAD';
  const nameFor = (userId: string, fallback: string) =>
    userId === me?.id ? 'You' : fallback;

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-primary text-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-6 sm:gap-8 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            <Link
              href={`/household/${householdId}`}
              className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-white"
            >
              <span aria-hidden>←</span>
              <span>Back to house</span>
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: 'h-9 w-9 rounded-full' } }}
            />
          </div>

          {isLoading || !bill ? (
            <div className="flex flex-col gap-1">
              <p className="text-[15px] text-white/70">Loading…</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-white/60">
                {bill.recurrence === 'NONE'
                  ? 'Bill'
                  : `${bill.recurrence.toLowerCase()} bill`}
              </p>
              <h1 className="text-[28px] font-bold leading-tight sm:text-[34px]">
                {bill.title}
              </h1>
              <p className="text-[42px] font-bold tabular-nums leading-none">
                {formatMoney(bill.amountCents, currency)}
              </p>
              <p className="text-[15px] text-white/70">
                Paid by{' '}
                <span className="font-bold text-white">
                  {nameFor(bill.payerId, bill.payer.name)}
                </span>
                <span aria-hidden className="mx-2 text-white/40">·</span>
                {new Intl.DateTimeFormat('en-CA', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(bill.occurredAt))}
              </p>
            </div>
          )}
        </div>
      </header>

      <section className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-10">
        {bill ? (
          <>
            <div className="flex flex-col gap-3">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-muted">
                Split
              </h2>
              <ul className="divide-y divide-line rounded-card border border-line">
                {bill.splits.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-white">
                        {(s.user.name ?? '?').slice(0, 1).toUpperCase()}
                      </div>
                      <p className="text-[15px] font-bold text-text">
                        {nameFor(s.userId, s.user.name)}
                        {s.userId === bill.payerId ? (
                          <span className="ml-2 text-[12px] font-bold uppercase tracking-wider text-primary-text-soft">
                            payer
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <span className="text-[15px] font-bold tabular-nums text-text">
                      {formatMoney(s.shareCents, currency)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-[12px] text-text-muted">
                Shares are tracked at the bill level. Settle balances across all
                bills from the house page.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-muted">
                Manage
              </h2>
              {confirmingDelete ? (
                <div className="flex flex-col gap-3 rounded-card border border-fail/30 bg-fail/5 p-4">
                  <p className="text-[15px] text-text">
                    Delete this bill? Balances will rebalance after.
                  </p>
                  {deleteBill.error ? (
                    <p className="text-[13px] text-fail">{deleteBill.error.message}</p>
                  ) : null}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      disabled={deleteBill.isPending}
                      className="h-[40px] rounded-button px-4 text-[14px] font-bold text-text-muted transition-colors hover:text-text disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBill.mutate({ householdId, billId })}
                      disabled={deleteBill.isPending}
                      className="h-[40px] rounded-button bg-fail px-5 text-[14px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
                    >
                      {deleteBill.isPending ? 'Deleting…' : 'Delete bill'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="self-start text-[14px] font-bold text-fail transition-colors hover:opacity-80"
                >
                  Delete bill
                </button>
              )}
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
