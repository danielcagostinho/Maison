import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-primary-faint">
      {/* Top text block — small MAISON wordmark, big purple tagline.
          Mirrors the legacy SigninScreen.js layout. */}
      <div className="reveal flex flex-col items-center px-6 pt-16 sm:pt-24">
        <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-muted">
          Maison
        </p>
        <h1 className="mt-3 max-w-xl text-center text-[34px] font-bold leading-[1.15] tracking-[0.005em] text-primary sm:text-[44px]">
          Housemate Sharing Made Easier
        </h1>
      </div>

      {/* Illustration. Pulled from the legacy app — those four
          housemates have been here all along. */}
      <div
        className="reveal-fade flex flex-1 items-center justify-center px-6"
        style={{ animationDelay: '0.1s' }}
      >
        <Image
          src="/signin.png"
          alt=""
          width={690}
          height={540}
          priority
          className="h-auto w-full max-w-[520px]"
        />
      </div>

      {/* White sign-in card pinned to the bottom. */}
      <div
        className="reveal sticky bottom-0 mt-auto bg-white"
        style={{ animationDelay: '0.2s' }}
      >
        <div className="mx-auto flex max-w-md flex-col gap-3 px-5 py-6 sm:py-8">
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="flex h-[50px] w-full items-center justify-center rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Sign in
              </button>
            </SignInButton>
            <p className="text-center text-[13px] text-text-muted">
              Free · Google or email
            </p>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="flex h-[50px] w-full items-center justify-center rounded-button bg-primary text-[17px] font-bold tracking-[-0.41px] text-white transition-all hover:brightness-110"
            >
              Open your dashboard
            </Link>
            <div className="flex items-center justify-center gap-3 pt-1 text-[13px] text-text-muted">
              <span>Signed in</span>
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </main>
  );
}
