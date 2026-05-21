import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-ink">
      {/* Faint ledger ruling — top + bottom hairlines */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-rule/60" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-px bg-rule/60" />

      {/* A barely-there vertical hairline running down the page,
          like the binding of a notebook. */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-[max(2rem,calc(50%-32rem))] top-0 bottom-0 hidden w-px bg-rule/40 md:block"
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 md:px-10 md:py-12">
        {/* ── Top bar ─────────────────────────────────────────── */}
        <header className="flex items-center justify-between reveal-fade">
          <span className="smallcaps text-ink-3">
            Maison <span aria-hidden className="mx-1 text-ink-5">·</span> n° 01
          </span>
          <span className="smallcaps font-mono text-ink-3">MMXXVI</span>
        </header>

        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="flex flex-1 flex-col justify-center py-12 md:py-20">
          <div className="reveal">
            <h1 className="font-display text-[clamp(4.5rem,18vw,14rem)] font-medium leading-[0.85] tracking-tight">
              Maison<span className="text-stamp">.</span>
            </h1>
          </div>

          <p
            className="reveal mt-8 max-w-xl font-display text-2xl italic leading-tight text-ink-2 md:text-3xl"
            style={{ animationDelay: '0.15s' }}
          >
            A household ledger for the people you live with.
          </p>

          <div
            className="reveal-rule mt-12 h-px origin-left bg-rule md:mt-16"
            style={{ animationDelay: '0.35s' }}
          />

          <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
            <div
              className="reveal space-y-2.5 font-display text-xl leading-snug text-ink-2 md:col-span-7 md:text-[1.75rem]"
              style={{ animationDelay: '0.5s' }}
            >
              <p>
                <span className="mr-3 font-mono text-sm font-normal text-ink-4">i.</span>
                Split the rent, the groceries, the absurd Costco run.
              </p>
              <p>
                <span className="mr-3 font-mono text-sm font-normal text-ink-4">ii.</span>
                Settle up without spreadsheets.
              </p>
              <p>
                <span className="mr-3 font-mono text-sm font-normal text-ink-4">iii.</span>
                Stay friends.
              </p>
            </div>

            <div
              className="reveal flex flex-col justify-end gap-4 md:col-span-5 md:items-end"
              style={{ animationDelay: '0.7s' }}
            >
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="group relative inline-flex items-center gap-3 rounded-sm bg-stamp px-7 py-3.5 text-paper-soft transition-all hover:bg-stamp-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-stamp-soft focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  >
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.32em]">
                      Sign in
                    </span>
                    <span
                      aria-hidden
                      className="text-base leading-none transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </button>
                </SignInButton>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ink-4">
                  Free · Google or email
                </p>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-3 rounded-sm bg-stamp px-7 py-3.5 text-paper-soft transition-all hover:bg-stamp-hover"
                >
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.32em]">
                    Open ledger
                  </span>
                  <span
                    aria-hidden
                    className="text-base leading-none transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-ink-4">
                    Signed in
                  </span>
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* ── Footer / colophon ───────────────────────────────── */}
        <footer
          className="reveal-fade flex items-end justify-between gap-4 pt-8"
          style={{ animationDelay: '0.9s' }}
        >
          <p className="smallcaps text-ink-4">Made for housemates</p>
          <p className="smallcaps font-mono text-ink-4">est. 2026</p>
        </footer>
      </div>
    </main>
  );
}
