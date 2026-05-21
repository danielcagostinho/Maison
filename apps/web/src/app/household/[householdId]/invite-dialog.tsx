'use client';

import { useEffect, useState } from 'react';

import { trpc } from '@/trpc/client';

type Props = {
  householdId: string;
  householdName: string;
  isOwner: boolean;
  onClose: () => void;
};

export function InviteDialog({ householdId, householdName, isOwner, onClose }: Props) {
  const utils = trpc.useUtils();

  const { data: invites, isLoading } = trpc.invite.list.useQuery({ householdId });

  const createInvite = trpc.invite.create.useMutation({
    onSuccess: () => utils.invite.list.invalidate({ householdId }),
  });
  const revokeInvite = trpc.invite.revoke.useMutation({
    onSuccess: () => utils.invite.list.invalidate({ householdId }),
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-dialog-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="reveal-fade absolute inset-0 bg-text/40"
      />

      <div className="reveal-scale relative flex w-full max-w-md flex-col gap-6 rounded-card bg-white p-6 shadow-2xl sm:p-7">
        <div className="flex flex-col gap-1">
          <h2 id="invite-dialog-title" className="text-[22px] font-bold leading-snug text-text">
            Invite housemates
          </h2>
          <p className="text-[15px] text-text-muted">
            Anyone with the link can join <span className="font-bold">{householdName}</span>.
          </p>
        </div>

        {isLoading ? (
          <p className="text-[14px] text-text-muted">Loading…</p>
        ) : invites && invites.length > 0 ? (
          <div className="flex flex-col gap-3">
            {invites.map((inv) => (
              <InviteRow
                key={inv.id}
                code={inv.code}
                inviteId={inv.id}
                householdId={householdId}
                canRevoke={isOwner}
                onRevoke={() => revokeInvite.mutate({ householdId, inviteId: inv.id })}
                revoking={revokeInvite.isPending}
              />
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-text-muted">No active invites yet.</p>
        )}

        {isOwner ? (
          <button
            type="button"
            onClick={() => createInvite.mutate({ householdId })}
            disabled={createInvite.isPending}
            className="h-[44px] rounded-button bg-primary text-[15px] font-bold tracking-[-0.3px] text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            {createInvite.isPending ? 'Generating…' : 'Generate new link'}
          </button>
        ) : (
          <p className="text-[13px] italic text-text-muted">
            Only the household owner can create or revoke invite links.
          </p>
        )}

        {createInvite.error ? (
          <p className="text-[13px] text-fail">{createInvite.error.message}</p>
        ) : null}
      </div>
    </div>
  );
}

function InviteRow({
  code,
  inviteId,
  householdId,
  canRevoke,
  onRevoke,
  revoking,
}: {
  code: string;
  inviteId: string;
  householdId: string;
  canRevoke: boolean;
  onRevoke: () => void;
  revoking: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== 'undefined' ? `${window.location.origin}/invite/${code}` : '';

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be blocked on insecure contexts — swallow silently.
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-card border border-line bg-primary-faint p-4">
      <p className="break-all font-mono text-[13px] text-text">{url}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] text-text-muted">
          Code: <span className="font-bold text-text">{code}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copy}
            className="h-[32px] rounded-button bg-primary px-3 text-[12px] font-bold text-white transition-all hover:brightness-110"
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          {canRevoke ? (
            <button
              type="button"
              onClick={onRevoke}
              disabled={revoking}
              aria-label="Revoke invite"
              title="Revoke this invite"
              className="h-[32px] rounded-button px-2 text-[12px] font-bold text-text-muted transition-colors hover:text-fail disabled:opacity-50"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
