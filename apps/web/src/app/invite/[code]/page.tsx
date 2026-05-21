'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';

import { trpc } from '@/trpc/client';

type PageProps = { params: Promise<{ code: string }> };

export default function InviteAcceptPage({ params }: PageProps) {
  const { code } = use(params);
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: me } = trpc.user.me.useQuery();
  const { data: invite, isLoading, error } = trpc.invite.byCode.useQuery({ code });

  const acceptInvite = trpc.invite.accept.useMutation({
    onSuccess: ({ householdId }) => {
      utils.household.list.invalidate();
      router.replace(`/household/${householdId}`);
    },
  });

  return (
    <main className="min-h-screen bg-primary-faint">
      <header className="bg-primary text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8 sm:py-7">
          <Link
            href="/dashboard"
            className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-white"
          >
            Maison
          </Link>
          <UserButton
            appearance={{ elements: { avatarBox: 'h-9 w-9 rounded-full' } }}
          />
        </div>
      </header>

      <section className="mx-auto flex max-w-md flex-col items-center gap-8 px-5 py-14 sm:py-20">
        {isLoading ? (
          <p className="text-[15px] text-text-muted">Loading invite…</p>
        ) : error || !invite ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-[26px] font-bold leading-snug text-text">
              Invite not found
            </h1>
            <p className="max-w-sm text-[15px] text-text-muted">
              {error?.message ?? 'This invite link is invalid or has been revoked.'}
            </p>
            <Link
              href="/dashboard"
              className="mt-3 inline-flex h-[44px] items-center justify-center rounded-button bg-primary px-6 text-[15px] font-bold tracking-[-0.3px] text-white transition-all hover:brightness-110"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-7 rounded-card bg-white p-8 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-faint">
              <HouseIcon />
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-text-muted">
                You&apos;re invited
              </p>
              <h1 className="text-[28px] font-bold leading-tight text-text">
                Join {invite.household.name}
              </h1>
              <p className="text-[15px] text-text-muted">
                <span className="font-bold text-text">{invite.createdBy.name}</span>{' '}
                invited you to start splitting bills together. There{' '}
                {invite.household.members.length === 1 ? 'is' : 'are'} already{' '}
                {invite.household.members.length}{' '}
                {invite.household.members.length === 1 ? 'housemate' : 'housemates'}{' '}
                inside.
              </p>
            </div>

            {invite.household.members.some((m) => m.userId === me?.id) ? (
              <Link
                href={`/household/${invite.householdId}`}
                className="flex h-[50px] w-full items-center justify-center rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110"
              >
                Open house
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => acceptInvite.mutate({ code })}
                disabled={acceptInvite.isPending}
                className="h-[50px] w-full rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110 disabled:opacity-50"
              >
                {acceptInvite.isPending ? 'Joining…' : 'Join house'}
              </button>
            )}

            {acceptInvite.error ? (
              <p className="text-[13px] text-fail">{acceptInvite.error.message}</p>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}

function HouseIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4900a7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}
