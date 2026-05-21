'use client';

import { formatMoney, splitEvenly } from '@maison/shared';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { trpc } from '@/trpc/client';

type Member = { user: { id: string; name: string } };
type Step = 'title' | 'amount' | 'housemates' | 'complete';

type Props = {
  household: { id: string; currency: string; members: Member[] };
  defaultPayerId: string;
  onClose: () => void;
};

// Multi-step "Split Bill" sheet mirroring the legacy native flow:
//   title → amount → housemates → complete (confetti).
// Bottom sheet on mobile, centered modal on desktop.
export function NewBillDialog({ household, defaultPayerId, onClose }: Props) {
  const utils = trpc.useUtils();

  const [step, setStep] = useState<Step>('title');
  const [title, setTitle] = useState('');
  const [amountInput, setAmountInput] = useState('');
  // Selected members for the split. Payer is always selected.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set([defaultPayerId]),
  );

  const amountCents = parseAmountCents(amountInput);
  const selectedMembers = household.members.filter((m) => selectedIds.has(m.user.id));
  const splits =
    amountCents && selectedMembers.length > 0
      ? splitEvenly(amountCents, selectedMembers.length).map((shareCents, i) => ({
          userId: selectedMembers[i]!.user.id,
          shareCents,
        }))
      : [];

  const createBill = trpc.bill.create.useMutation({
    onSuccess: () => {
      utils.bill.list.invalidate({ householdId: household.id });
      utils.settlement.forHousehold.invalidate({ householdId: household.id });
      setStep('complete');
    },
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !createBill.isPending && step !== 'complete') {
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, createBill.isPending, step]);

  useEffect(() => {
    if (step !== 'complete') return;
    const palette = ['#4900a7', '#d1cced', '#9d8ccb', '#f8f5fb'];
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.35 }, colors: palette });
    const t = setTimeout(
      () => confetti({ particleCount: 50, spread: 100, origin: { y: 0.4 }, colors: palette }),
      250,
    );
    return () => clearTimeout(t);
  }, [step]);

  function handleBack() {
    if (step === 'title') onClose();
    else if (step === 'amount') setStep('title');
    else if (step === 'housemates') setStep('amount');
  }

  function handleNext() {
    if (step === 'title' && title.trim()) setStep('amount');
    else if (step === 'amount' && amountCents !== null && amountCents > 0) {
      setStep('housemates');
    } else if (step === 'housemates' && splits.length > 0 && amountCents) {
      createBill.mutate({
        householdId: household.id,
        payerId: defaultPayerId,
        title: title.trim(),
        amountCents,
        occurredAt: new Date(),
        recurrence: 'NONE',
        splits,
      });
    } else if (step === 'complete') onClose();
  }

  function toggleMember(memberId: string) {
    if (memberId === defaultPayerId) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  }

  const showHeader = step !== 'complete';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => !createBill.isPending && step !== 'complete' && onClose()}
        className="reveal-fade absolute inset-0 bg-text/40"
      />

      <div className="reveal-scale relative flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-card bg-white shadow-2xl sm:max-w-md sm:rounded-card">
        {showHeader && (
          <SheetHeader
            canBack={true}
            onBack={handleBack}
            onCancel={onClose}
            disabled={createBill.isPending}
          />
        )}

        <div className="flex flex-1 flex-col overflow-y-auto">
          {step === 'title' && (
            <TitleStep title={title} setTitle={setTitle} onNext={handleNext} />
          )}
          {step === 'amount' && (
            <AmountStep
              title={title}
              amountInput={amountInput}
              setAmountInput={setAmountInput}
              currency={household.currency}
              canSubmit={amountCents !== null && amountCents > 0}
              onNext={handleNext}
            />
          )}
          {step === 'housemates' && (
            <HousematesStep
              members={household.members}
              selectedIds={selectedIds}
              defaultPayerId={defaultPayerId}
              onToggle={toggleMember}
              amountCents={amountCents ?? 0}
              currency={household.currency}
              submitting={createBill.isPending}
              errorMessage={createBill.error?.message ?? null}
              onSubmit={handleNext}
            />
          )}
          {step === 'complete' && (
            <CompleteStep
              members={selectedMembers}
              defaultPayerId={defaultPayerId}
              onDone={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SheetHeader({
  canBack,
  onBack,
  onCancel,
  disabled,
}: {
  canBack: boolean;
  onBack: () => void;
  onCancel: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between bg-primary-faint px-4 py-3">
      <button
        type="button"
        onClick={onBack}
        disabled={disabled || !canBack}
        className="flex-1 text-left text-[15px] text-primary transition-colors hover:opacity-80 disabled:opacity-50"
      >
        ← Back
      </button>
      <p className="flex-1 text-center text-[15px] font-bold text-text">Split Bill</p>
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="flex-1 text-right text-[15px] text-primary transition-colors hover:opacity-80 disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}

function TitleStep({
  title,
  setTitle,
  onNext,
}: {
  title: string;
  setTitle: (s: string) => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="relative h-44 overflow-hidden bg-primary-faint">
        <div className="absolute inset-x-0 top-4 flex items-end justify-center gap-4">
          <Image
            src="/illustrations/newtransaction-illustration-1.png"
            alt=""
            width={220}
            height={340}
            className="h-40 w-auto object-contain"
            priority
          />
          <Image
            src="/illustrations/newtransaction-illustration-2.png"
            alt=""
            width={280}
            height={320}
            className="h-36 w-auto object-contain"
            priority
          />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) onNext();
        }}
        className="flex flex-col gap-6 bg-white px-5 py-6"
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-[28px] font-bold leading-tight text-text">
            What is this for?
          </h2>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(capitalizeFirst(e.target.value))}
            placeholder="Dinner, groceries, rent…"
            maxLength={120}
            required
            className="border-0 border-b border-primary-soft bg-transparent pb-2 text-[24px] text-primary placeholder:text-primary-text-soft focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!title.trim()}
          className="h-[50px] rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110 disabled:opacity-50"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

function AmountStep({
  title,
  amountInput,
  setAmountInput,
  currency,
  canSubmit,
  onNext,
}: {
  title: string;
  amountInput: string;
  setAmountInput: (s: string) => void;
  currency: string;
  canSubmit: boolean;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="relative h-44 overflow-hidden bg-primary-faint">
        <div className="absolute inset-x-0 top-2 flex justify-center">
          <Image
            src="/illustrations/newtransaction-illustration-3.png"
            alt=""
            width={400}
            height={400}
            className="h-44 w-auto object-contain"
            priority
          />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) onNext();
        }}
        className="flex flex-col gap-6 bg-white px-5 py-6"
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-[26px] font-bold leading-tight text-text sm:text-[28px]">
            How much was <span className="font-normal text-primary">{title}</span>?
          </h2>
          <div className="flex items-baseline justify-center gap-1 py-2">
            <span className="text-[34px] font-bold text-primary tabular-nums">$</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="0"
              required
              className="w-48 border-0 bg-transparent text-center text-[56px] font-bold tabular-nums text-primary placeholder:text-primary-soft focus:outline-none"
            />
          </div>
          <p className="text-center text-[12px] uppercase tracking-[0.2em] text-text-muted">
            {currency}
          </p>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-[50px] rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110 disabled:opacity-50"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

function HousematesStep({
  members,
  selectedIds,
  defaultPayerId,
  onToggle,
  amountCents,
  currency,
  submitting,
  errorMessage,
  onSubmit,
}: {
  members: Member[];
  selectedIds: Set<string>;
  defaultPayerId: string;
  onToggle: (id: string) => void;
  amountCents: number;
  currency: string;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
}) {
  const selected = members.filter((m) => selectedIds.has(m.user.id));
  const shareCents = selected.length > 0 ? Math.floor(amountCents / selected.length) : 0;

  // Sort: payer first so the sentence reads naturally.
  const sorted = [...members].sort((a, b) =>
    a.user.id === defaultPayerId ? -1 : b.user.id === defaultPayerId ? 1 : 0,
  );

  // "Splitting $X with [other selected names]"
  const othersSelected = selected
    .filter((m) => m.user.id !== defaultPayerId)
    .map((m) => firstName(m.user.name));

  return (
    <div className="flex flex-col">
      <div className="relative h-40 overflow-hidden bg-primary-faint">
        <div className="absolute inset-x-0 top-2 flex justify-center">
          <Image
            src="/illustrations/newtransaction-illustration-4.png"
            alt=""
            width={480}
            height={240}
            className="h-36 w-auto object-contain"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 bg-white px-5 py-6">
        <h2 className="text-[22px] font-bold leading-snug text-text sm:text-[24px]">
          Splitting{' '}
          <span className="text-primary">
            {formatMoney(amountCents, currency)}
          </span>
          {othersSelected.length > 0 ? (
            <>
              {' with '}
              {othersSelected.map((name, i) => (
                <span key={name}>
                  <span className="text-primary">{name}</span>
                  {joiner(i, othersSelected.length)}
                </span>
              ))}
            </>
          ) : (
            <span className="text-text-muted"> by yourself</span>
          )}
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {sorted.map((m) => {
            const isSelected = selectedIds.has(m.user.id);
            const isPayer = m.user.id === defaultPayerId;
            return (
              <button
                key={m.user.id}
                type="button"
                onClick={() => onToggle(m.user.id)}
                disabled={isPayer || submitting}
                aria-pressed={isSelected}
                className={
                  isSelected
                    ? 'flex flex-col items-center gap-2 rounded-card bg-primary-faint p-3 transition-all disabled:cursor-default'
                    : 'flex flex-col items-center gap-2 rounded-card border border-line bg-white p-3 transition-all hover:border-primary-soft'
                }
              >
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-[20px] font-bold text-white">
                    {firstName(m.user.name).slice(0, 1).toUpperCase()}
                  </div>
                  {isSelected ? (
                    <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
                      <CheckIcon />
                    </div>
                  ) : null}
                </div>
                <p className="text-[13px] font-bold text-text">
                  {isPayer ? `${firstName(m.user.name)} (you)` : firstName(m.user.name)}
                </p>
                <p
                  className={
                    isSelected
                      ? 'text-[14px] font-bold tabular-nums text-primary'
                      : 'text-[14px] font-bold tabular-nums text-primary-text-soft/60'
                  }
                >
                  {isSelected ? formatMoney(shareCents, currency) : '—'}
                </p>
              </button>
            );
          })}
        </div>

        {errorMessage ? (
          <p className="text-[14px] text-fail">{errorMessage}</p>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || selected.length === 0}
          className="h-[50px] rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? 'Splitting…' : `Split with ( ${selected.length} )`}
        </button>
      </div>
    </div>
  );
}

function CompleteStep({
  members,
  defaultPayerId,
  onDone,
}: {
  members: Member[];
  defaultPayerId: string;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 bg-white px-5 pb-6 pt-10">
      <Image
        src="/illustrations/complete.png"
        alt=""
        width={200}
        height={300}
        className="h-44 w-auto object-contain"
        priority
      />
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-[28px] font-bold text-primary">Bill Split</h2>
        <p className="text-[15px] italic text-primary-text-soft">
          Sit back and enjoy a cup of joe!
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-primary">
          Split With
        </p>
        <div className="flex flex-wrap items-start justify-center gap-3">
          {members.map((m) => (
            <div key={m.user.id} className="flex w-16 flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-[16px] font-bold text-white">
                {firstName(m.user.name).slice(0, 1).toUpperCase()}
              </div>
              <p className="text-center text-[12px] text-text">
                {m.user.id === defaultPayerId ? 'Me' : firstName(m.user.name)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="mt-2 h-[50px] w-full rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110"
      >
        OK
      </button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function firstName(fullName: string) {
  return fullName.split(' ')[0] ?? fullName;
}

function capitalizeFirst(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function joiner(index: number, total: number) {
  if (index === total - 1) return '';
  if (index === total - 2) return ' and ';
  return ', ';
}

function parseAmountCents(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const value = Number.parseFloat(trimmed);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100);
}
