import { auth } from '@clerk/nextjs/server';
import { appRouter, createContext } from '@maison/api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export async function handleTRPCRequest(req: Request) {
  const { userId } = await auth();

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ auth: { clerkUserId: userId } }),
  });
}
