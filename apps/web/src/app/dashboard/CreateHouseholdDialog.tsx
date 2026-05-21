'use client';

import { useEffect, useRef, useState } from 'react';

import { trpc } from '@/trpc/client';

export function CreateHouseholdDialog({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('CAD');
  const utils = trpc.useUtils();

  const createHousehold = trpc.household.create.useMutation({
    onSuccess: () => {
      utils.household.list.invalidate();
      onClose();
    },
  });

  // Autofocus the name input on open, and close on Escape.
  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !createHousehold.isPending) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, createHousehold.isPending]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || createHousehold.isPending) return;
    createHousehold.mutate({ name: name.trim(), currency });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-household-title"
    >
      {/* Backdrop — an ink wash, not a solid black. */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => !createHousehold.isPending && onClose()}
        className="reveal-fade absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />

      <form
        onSubmit={handleSubmit}
        className="reveal relative w-full max-w-md border border-rule bg-paper-soft p-8 shadow-[0_30px_60px_-30px_rgba(26,24,20,0.35)]"
        style={{ animationDuration: '0.45s' }}
      >
        {/* Small ledger header at the top of the card. */}
        <div className="flex items-baseline justify-between">
          <p className="smallcaps text-ink-4">Open a house</p>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ink-5">
            Entry n° 01
          </p>
        </div>

        <h2
          id="create-household-title"
          className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight"
        >
          What do you call it?
        </h2>
        <p className="mt-2 font-display italic text-ink-2">
          The address works. So does a nickname.
        </p>

        <div className="mt-7 space-y-5">
          <label className="block">
            <span className="smallcaps mb-2 block text-ink-3">House name</span>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 123 Main St"
              maxLength={80}
              required
              className="w-full border-b border-ink/60 bg-transparent pb-2 font-display text-2xl tracking-tight text-ink placeholder:text-ink-5/70 focus:border-stamp focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="smallcaps mb-2 block text-ink-3">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border-b border-ink/60 bg-transparent pb-2 font-mono text-base text-ink focus:border-stamp focus:outline-none"
            >
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
            </select>
          </label>
        </div>

        {createHousehold.error ? (
          <p className="mt-5 font-display italic text-debit">
            {createHousehold.error.message}
          </p>
        ) : null}

        <div className="mt-9 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={createHousehold.isPending}
            className="smallcaps text-ink-3 underline decoration-rule decoration-dotted underline-offset-4 transition-colors hover:text-stamp disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!name.trim() || createHousehold.isPending}
            className="group inline-flex items-center gap-3 rounded-sm bg-stamp px-6 py-3 text-paper-soft transition-all hover:bg-stamp-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.32em]">
              {createHousehold.isPending ? 'Opening…' : 'Open house'}
            </span>
            <span
              aria-hidden
              className="text-base leading-none transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
