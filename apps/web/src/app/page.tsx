import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

// Placeholder landing page. The frontend-design pass will replace this
// with the polished marketing surface.
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-semibold">Maison</h1>
      <p className="text-center text-lg text-gray-600">
        Roommate bill splitting. Split bills, settle up, stay friends.
      </p>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-md bg-black px-4 py-2 text-white">Sign in</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard" className="rounded-md bg-black px-4 py-2 text-white">
            Go to dashboard
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </main>
  );
}
