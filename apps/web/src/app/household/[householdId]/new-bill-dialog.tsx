'use client';

import { formatMoney, splitEvenly } from '@maison/shared';
import { useEffect, useRef, useState } from 'react';

import { trpc } from '@/trpc/client';

type Member = { user: { id: string; name: string } };

type Props = {
  household: { id: string; currency: string; members: Member[] };
  defaultPayerId: string;
  onClose: () => void;
};

type Recurrence = 'NONE' | 'WEEKLY' | 'MONTHLY';

export function NewBillDialog({ household, defaultPayerId, onClose }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState(defaultPayerId);
  const [occurredAt, setOccurredAt] = useState(() => todayIso());
  const [recurrence, setRecurrence] = useState<Recurrence>('NONE');

  const createBill = trpc.bill.create.useMutation({
    onSuccess: () => {
      utils.bill.list.invalidate({ householdId: household.id });
      utils.settlement.forHousehold.invalidate({ householdId: household.id });
      onClose();
    },
  });

  useEffect(() => {
    titleRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !createBill.isPending) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, createBill.isPending]);

  const amountCents = parseAmountCents(amount);
  const splits =
    amountCents && household.members.length > 0
      ? splitEvenly(amountCents, household.members.length).map((shareCents, i) => ({
          userId: household.members[i]!.user.id,
          shareCents,
        }))
      : [];
  const perPersonCents = splits[0]?.shareCents ?? 0;

  const canSubmit =
    title.trim().length > 0 &&
    amountCents !== null &&
    amountCents > 0 &&
    !createBill.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || amountCents === null) return;
    createBill.mutate({
      householdId: household.id,
      payerId,
      title: title.trim(),
      amountCents,
      occurredAt: new Date(occurredAt),
      recurrence,
      splits,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-bill-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => !createBill.isPending && onClose()}
        className="reveal-fade absolute inset-0 bg-text/40"
      />

      <form
        onSubmit={handleSubmit}
        className="reveal-scale relative flex w-full max-w-md flex-col gap-6 rounded-card bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="flex flex-col gap-1">
          <h2 id="new-bill-title" className="text-[22px] font-bold leading-snug text-text">
            Log a bill
          </h2>
          <p className="text-[15px] text-text-muted">
            Split evenly across all {household.members.length}{' '}
            {household.members.length === 1 ? 'housemate' : 'housemates'}.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold text-text">What&apos;s this for?</span>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Groceries"
              maxLength={120}
              required
              className="rounded-button border border-line bg-primary-faint px-4 py-3 text-[16px] text-text placeholder:text-primary-text-soft focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold text-text">
              Amount ({household.currency})
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="rounded-button border border-line bg-primary-faint px-4 py-3 text-[16px] tabular-nums text-text placeholder:text-primary-text-soft focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {perPersonCents > 0 && (
              <span className="text-[13px] text-text-muted">
                {formatMoney(perPersonCents, household.currency)} per person
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold text-text">Paid by</span>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="appearance-none rounded-button border border-line bg-primary-faint bg-[length:16px] bg-[right_16px_center] bg-no-repeat px-4 py-3 pr-10 text-[16px] text-text focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              style={{ backgroundImage: chevron }}
            >
              {household.members.map((m) => (
                <option key={m.user.id} value={m.user.id}>
                  {m.user.id === defaultPayerId ? `${m.user.name} (you)` : m.user.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-bold text-text">Date</span>
              <input
                type="date"
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
                required
                className="rounded-button border border-line bg-primary-faint px-4 py-3 text-[16px] text-text focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-bold text-text">Repeats</span>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as Recurrence)}
                className="appearance-none rounded-button border border-line bg-primary-faint bg-[length:16px] bg-[right_16px_center] bg-no-repeat px-4 py-3 pr-10 text-[16px] text-text focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{ backgroundImage: chevron }}
              >
                <option value="NONE">Never</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </label>
          </div>
        </div>

        {createBill.error ? (
          <p className="text-[14px] text-fail">{createBill.error.message}</p>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={createBill.isPending}
            className="h-[44px] rounded-button px-5 text-[15px] font-bold text-text-muted transition-colors hover:text-text disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-[44px] rounded-button bg-primary px-6 text-[15px] font-bold tracking-[-0.3px] text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createBill.isPending ? 'Saving…' : 'Add bill'}
          </button>
        </div>
      </form>
    </div>
  );
}

function todayIso() {
  const now = new Date();
  const tz = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
}

// Parse a money-style decimal string ("25.99") into integer cents.
// Returns null when the input is empty or malformed — caller treats
// that as "not yet a valid amount."
function parseAmountCents(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const value = Number.parseFloat(trimmed);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100);
}

const chevron =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234900a7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";
