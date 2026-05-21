'use client';

import { UserButton } from '@clerk/nextjs';

import { trpc } from '@/trpc/client';

// Placeholder dashboard. The frontend-design pass will replace this with
// the real household / bills / settle-up surface.
export default function DashboardPage() {
  const { data: me } = trpc.user.me.useQuery();
  const { data: households, isLoading } = trpc.household.list.useQuery();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Maison</h1>
        <UserButton />
      </header>

      <section className="mb-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
          Signed in as
        </h2>
        <p className="mt-1 text-lg">{me?.name ?? '…'}</p>
        <p className="text-sm text-gray-500">{me?.email}</p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
          Your households
        </h2>
        {isLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : households && households.length > 0 ? (
          <ul className="space-y-2">
            {households.map((h) => (
              <li key={h.id} className="rounded-md border p-4">
                <div className="font-medium">{h.name}</div>
                <div className="text-sm text-gray-500">{h.currency}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No households yet. Create one to get started.</p>
        )}
      </section>
    </main>
  );
}
