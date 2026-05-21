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
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-household-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => !createHousehold.isPending && onClose()}
        className="reveal-fade absolute inset-0 bg-text/40"
      />

      <form
        onSubmit={handleSubmit}
        className="reveal-scale relative w-full max-w-md rounded-card bg-white p-6 shadow-2xl sm:p-7"
      >
        <h2
          id="create-household-title"
          className="text-[22px] font-bold leading-snug text-text"
        >
          Open a house
        </h2>
        <p className="mt-1 text-[15px] text-text-muted">
          Give it a name. The address works, so does a nickname.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-text">
              House name
            </span>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 123 Main St"
              maxLength={80}
              required
              className="w-full rounded-button border border-line bg-primary-faint px-4 py-3 text-[16px] text-text placeholder:text-primary-text-soft focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-text">
              Currency
            </span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full appearance-none rounded-button border border-line bg-primary-faint bg-[length:16px] bg-[right_16px_center] bg-no-repeat px-4 py-3 pr-10 text-[16px] text-text focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234900a7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
              }}
            >
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
            </select>
          </label>
        </div>

        {createHousehold.error ? (
          <p className="mt-4 text-[14px] text-fail">
            {createHousehold.error.message}
          </p>
        ) : null}

        <div className="mt-7 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={createHousehold.isPending}
            className="h-[44px] rounded-button px-5 text-[15px] font-bold text-text-muted transition-colors hover:text-text disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || createHousehold.isPending}
            className="h-[44px] rounded-button bg-primary px-6 text-[15px] font-bold tracking-[-0.3px] text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createHousehold.isPending ? 'Opening…' : 'Open house'}
          </button>
        </div>
      </form>
    </div>
  );
}
