'use client';

import { formatMoney } from '@maison/shared';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { trpc } from '@/trpc/client';

type Member = { user: { id: string; name: string } };
type Step = 'confirm' | 'done';

type Props = {
  household: { id: string; currency: string; members: Member[] };
  transfer: { fromUserId: string; toUserId: string; amountCents: number };
  currentUserId: string;
  onClose: () => void;
};

// Two-step settle-up sheet:
//   confirm → done (confetti).
// Pre-filled from a suggested transfer; user can add a note before
// recording the Payment.
export function SettleUpDialog({ household, transfer, currentUserId, onClose }: Props) {
  const utils = trpc.useUtils();

  const [step, setStep] = useState<Step>('confirm');
  const [note, setNote] = useState('');
  const noteRef = useRef<HTMLInputElement>(null);

  const from = household.members.find((m) => m.user.id === transfer.fromUserId)?.user;
  const to = household.members.find((m) => m.user.id === transfer.toUserId)?.user;

  const createPayment = trpc.payment.create.useMutation({
    onSuccess: () => {
      utils.payment.list.invalidate({ householdId: household.id });
      utils.settlement.forHousehold.invalidate({ householdId: household.id });
      setStep('done');
    },
  });

  useEffect(() => {
    noteRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !createPayment.isPending && step !== 'done') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, createPayment.isPending, step]);

  useEffect(() => {
    if (step !== 'done') return;
    const palette = ['#4900a7', '#00a469', '#d1cced', '#9d8ccb'];
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.4 }, colors: palette });
    const t = setTimeout(
      () => confetti({ particleCount: 60, spread: 100, origin: { y: 0.45 }, colors: palette }),
      250,
    );
    return () => clearTimeout(t);
  }, [step]);

  if (!from || !to) return null;

  function handleConfirm() {
    if (createPayment.isPending) return;
    createPayment.mutate({
      householdId: household.id,
      fromUserId: transfer.fromUserId,
      toUserId: transfer.toUserId,
      amountCents: transfer.amountCents,
      occurredAt: new Date(),
      note: note.trim() || undefined,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => !createPayment.isPending && step !== 'done' && onClose()}
        className="reveal-fade absolute inset-0 bg-text/40"
      />

      <div className="reveal-scale relative flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-card bg-white shadow-2xl sm:max-w-md sm:rounded-card">
        {step === 'confirm' && (
          <ConfirmStep
            from={from}
            to={to}
            amountCents={transfer.amountCents}
            currency={household.currency}
            currentUserId={currentUserId}
            note={note}
            setNote={setNote}
            noteRef={noteRef}
            onCancel={onClose}
            onConfirm={handleConfirm}
            submitting={createPayment.isPending}
            errorMessage={createPayment.error?.message ?? null}
          />
        )}

        {step === 'done' && (
          <DoneStep
            from={from}
            to={to}
            amountCents={transfer.amountCents}
            currency={household.currency}
            currentUserId={currentUserId}
            onDone={onClose}
          />
        )}
      </div>
    </div>
  );
}

function ConfirmStep({
  from,
  to,
  amountCents,
  currency,
  currentUserId,
  note,
  setNote,
  noteRef,
  onCancel,
  onConfirm,
  submitting,
  errorMessage,
}: {
  from: { id: string; name: string };
  to: { id: string; name: string };
  amountCents: number;
  currency: string;
  currentUserId: string;
  note: string;
  setNote: (s: string) => void;
  noteRef: React.RefObject<HTMLInputElement | null>;
  onCancel: () => void;
  onConfirm: () => void;
  submitting: boolean;
  errorMessage: string | null;
}) {
  const fromName = displayName(from, currentUserId);
  const toName = displayName(to, currentUserId);

  const headline =
    from.id === currentUserId
      ? `You're paying ${firstName(to.name)}`
      : to.id === currentUserId
        ? `${firstName(from.name)} is paying you`
        : `${firstName(from.name)} is paying ${firstName(to.name)}`;

  return (
    <>
      <div className="flex items-center justify-between bg-primary-faint px-4 py-3">
        <p className="flex-1 text-left text-[14px] text-text-muted">Settle Up</p>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="text-[15px] text-primary transition-colors hover:opacity-80 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      <div className="flex flex-col">
        <div className="relative h-44 overflow-hidden bg-primary-faint">
          <div className="absolute inset-x-0 top-2 flex justify-center">
            <Image
              src="/illustrations/settleup.png"
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
            onConfirm();
          }}
          className="flex flex-col gap-6 bg-white px-5 py-6"
        >
          <div className="flex flex-col items-center gap-2">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-primary">
              {headline}
            </p>
            <p className="text-[44px] font-bold tabular-nums leading-none text-primary">
              {formatMoney(amountCents, currency)}
            </p>
            <p className="text-[13px] text-text-muted">
              {fromName} <span aria-hidden>→</span> {toName}
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold text-text">Note (optional)</span>
            <input
              ref={noteRef}
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. rent + utilities"
              maxLength={280}
              className="rounded-button border border-line bg-primary-faint px-4 py-3 text-[16px] text-text placeholder:text-primary-text-soft focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          {errorMessage ? (
            <p className="text-[14px] text-fail">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="h-[50px] rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? 'Recording…' : 'Mark as paid'}
          </button>
        </form>
      </div>
    </>
  );
}

function DoneStep({
  from,
  to,
  amountCents,
  currency,
  currentUserId,
  onDone,
}: {
  from: { id: string; name: string };
  to: { id: string; name: string };
  amountCents: number;
  currency: string;
  currentUserId: string;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 bg-white px-5 pb-6 pt-12">
      <Image
        src="/illustrations/complete.png"
        alt=""
        width={200}
        height={300}
        className="h-44 w-auto object-contain"
        priority
      />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-[28px] font-bold text-primary">Settled up!</h2>
        <p className="text-center text-[15px] italic text-primary-text-soft">
          {formatMoney(amountCents, currency)} from{' '}
          {displayName(from, currentUserId)} to {displayName(to, currentUserId)}.
        </p>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="h-[50px] w-full rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110"
      >
        OK
      </button>
    </div>
  );
}

function firstName(fullName: string) {
  return fullName.split(' ')[0] ?? fullName;
}

function displayName({ id, name }: { id: string; name: string }, currentUserId: string) {
  return id === currentUserId ? 'you' : firstName(name);
}
