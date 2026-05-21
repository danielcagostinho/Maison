import { auth, currentUser } from '@clerk/nextjs/server';
import { appRouter, createContext } from '@maison/api';
import type { AuthContext } from '@maison/api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export async function handleTRPCRequest(req: Request) {
  const { userId } = await auth();
  const clerkUser = userId ? await currentUser() : null;

  const profile: AuthContext['profile'] = clerkUser
    ? {
        email:
          clerkUser.primaryEmailAddress?.emailAddress ??
          clerkUser.emailAddresses[0]?.emailAddress ??
          `${clerkUser.id}@pending.maison`,
        name:
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
          clerkUser.username ||
          'New User',
        avatarUrl: clerkUser.imageUrl,
      }
    : undefined;

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ auth: { clerkUserId: userId, profile } }),
  });
}
