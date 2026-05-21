import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';

import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodIssues: error.cause instanceof z.ZodError ? error.cause.issues : undefined,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Requires a verified Clerk session and a corresponding User row. If the
// Clerk user is signed in but has no User row yet, this middleware lazily
// creates one — keeping a server-side User model in sync with Clerk
// without a webhook (good enough for v1).
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.auth.clerkUserId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // Upsert is idempotent under concurrent requests (the batched tRPC
  // call on first sign-in fires queries in parallel) and self-heals
  // stale profile data on every request when the caller supplies a
  // fresh profile snapshot.
  const { profile } = ctx.auth;
  const user = await ctx.prisma.user.upsert({
    where: { clerkId: ctx.auth.clerkUserId },
    update: profile
      ? { email: profile.email, name: profile.name, avatarUrl: profile.avatarUrl }
      : {},
    create: {
      clerkId: ctx.auth.clerkUserId,
      email: profile?.email ?? `${ctx.auth.clerkUserId}@pending.maison`,
      name: profile?.name ?? 'New User',
      avatarUrl: profile?.avatarUrl,
    },
  });

  return next({ ctx: { ...ctx, user } });
});

// Requires the authed user to be a member of the household referenced by
// `input.householdId`. Throws FORBIDDEN otherwise.
export const householdProcedure = protectedProcedure
  .input(z.object({ householdId: z.string().min(1) }))
  .use(async ({ ctx, input, next }) => {
    const membership = await ctx.prisma.householdMember.findUnique({
      where: {
        householdId_userId: {
          householdId: input.householdId,
          userId: ctx.user.id,
        },
      },
    });
    if (!membership) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this household' });
    }
    return next({ ctx: { ...ctx, membership } });
  });
