'use client';

import { UserButton } from '@clerk/nextjs';
import { formatMoney } from '@maison/shared';
import Link from 'next/link';
import { use } from 'react';

import { trpc } from '@/trpc/client';

type PageProps = { params: Promise<{ householdId: string }> };

type FeedItem =
  | {
      kind: 'bill';
      id: string;
      occurredAt: Date;
      title: string;
      amountCents: number;
      payerId: string;
      payerName: string;
      recurrence: 'NONE' | 'WEEKLY' | 'MONTHLY';
    }
  | {
      kind: 'payment';
      id: string;
      occurredAt: Date;
      amountCents: number;
      fromUserId: string;
      fromName: string;
      toUserId: string;
      toName: string;
      note: string | null;
    };

export default function ActivityFeedPage({ params }: PageProps) {
  const { householdId } = use(params);

  const { data: me } = trpc.user.me.useQuery();
  const { data: household } = trpc.household.get.useQuery({ householdId });
  const { data: bills } = trpc.bill.list.useQuery({ householdId });
  const { data: payments } = trpc.payment.list.useQuery({ householdId });

  const currency = household?.currency ?? 'CAD';
  const nameFor = (userId: string, fallback: string) =>
    userId === me?.id ? 'You' : fallback;

  const feed: FeedItem[] = [
    ...(bills ?? []).map<FeedItem>((b) => ({
      kind: 'bill',
      id: b.id,
      occurredAt: new Date(b.occurredAt),
      title: b.title,
      amountCents: b.amountCents,
      payerId: b.payerId,
      payerName: b.payer.name,
      recurrence: b.recurrence,
    })),
    ...(payments ?? []).map<FeedItem>((p) => ({
      kind: 'payment',
      id: p.id,
      occurredAt: new Date(p.occurredAt),
      amountCents: p.amountCents,
      fromUserId: p.fromUserId,
      fromName: p.from.name,
      toUserId: p.toUserId,
      toName: p.to.name,
      note: p.note,
    })),
  ].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());

  const groups = groupByDay(feed);

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
              <span>{household?.name ?? 'Back'}</span>
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: 'h-9 w-9 rounded-full' } }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-bold leading-tight sm:text-[34px]">Activity</h1>
            <p className="text-[15px] text-white/70">
              Every bill and payment, newest first.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto flex max-w-3xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
        {feed.length === 0 ? (
          <p className="text-[15px] text-text-muted">Nothing logged yet.</p>
        ) : (
          groups.map(({ label, items }) => (
            <div key={label} className="flex flex-col gap-3">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-muted">
                {label}
              </h2>
              <ul className="divide-y divide-line overflow-hidden rounded-card border border-line">
                {items.map((item) =>
                  item.kind === 'bill' ? (
                    <li key={`bill-${item.id}`}>
                      <Link
                        href={`/household/${householdId}/bill/${item.id}`}
                        className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-primary-faint"
                      >
                        <BillIcon />
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <p className="text-[15px] font-bold text-text">{item.title}</p>
                          <p className="text-[13px] text-text-muted">
                            <span className="font-bold">
                              {nameFor(item.payerId, item.payerName)}
                            </span>{' '}
                            paid
                            {item.recurrence !== 'NONE' && (
                              <>
                                <span aria-hidden className="mx-1.5 text-text-muted/50">
                                  ·
                                </span>
                                <span className="font-bold uppercase tracking-wider text-primary-text-soft">
                                  {item.recurrence.toLowerCase()}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        <span className="shrink-0 text-[15px] font-bold tabular-nums text-text">
                          {formatMoney(item.amountCents, currency)}
                        </span>
                      </Link>
                    </li>
                  ) : (
                    <li
                      key={`pay-${item.id}`}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <PaymentIcon />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="text-[15px] font-bold text-text">
                          {nameFor(item.fromUserId, item.fromName)}{' '}
                          <span aria-hidden className="font-normal text-text-muted">
                            →
                          </span>{' '}
                          {nameFor(item.toUserId, item.toName)}
                        </p>
                        <p className="text-[13px] text-text-muted">
                          Settle-up
                          {item.note && (
                            <>
                              <span aria-hidden className="mx-1.5 text-text-muted/50">
                                ·
                              </span>
                              <span className="italic">{item.note}</span>
                            </>
                          )}
                        </p>
                      </div>
                      <span className="shrink-0 text-[15px] font-bold tabular-nums text-success">
                        {formatMoney(item.amountCents, currency)}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

function BillIcon() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-faint">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4900a7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    </div>
  );
}

function PaymentIcon() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/15">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00a469"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

// Group feed items by day for a date-headered timeline view. Days are
// labeled relatively (Today / Yesterday / explicit date for older items).
function groupByDay(items: FeedItem[]): Array<{ label: string; items: FeedItem[] }> {
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = new Map<number, FeedItem[]>();
  for (const item of items) {
    const key = startOfDay(item.occurredAt).getTime();
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }

  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([key, items]) => {
      const date = new Date(key);
      let label: string;
      if (date.getTime() === today.getTime()) label = 'Today';
      else if (date.getTime() === yesterday.getTime()) label = 'Yesterday';
      else
        label = new Intl.DateTimeFormat('en-CA', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }).format(date);
      return { label, items };
    });
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
