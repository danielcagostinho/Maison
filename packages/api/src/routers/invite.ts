import { TRPCError } from '@trpc/server';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';

import { householdProcedure, protectedProcedure, router } from '../trpc';

// 8-char URL-safe code from 6 random bytes (~280 trillion combinations).
function newInviteCode() {
  return randomBytes(6).toString('base64url');
}

export const inviteRouter = router({
  // Active invites for a household. Requires membership.
  list: householdProcedure.query(({ ctx, input }) =>
    ctx.prisma.invite.findMany({
      where: { householdId: input.householdId, revokedAt: null },
      include: { createdBy: true },
      orderBy: { createdAt: 'desc' },
    }),
  ),

  // Create a fresh invite. Only the household OWNER can.
  create: householdProcedure.mutation(async ({ ctx, input }) => {
    if (ctx.membership.role !== 'OWNER') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only the household owner can create invites.',
      });
    }
    return ctx.prisma.invite.create({
      data: {
        householdId: input.householdId,
        code: newInviteCode(),
        createdById: ctx.user.id,
      },
    });
  }),

  // Revoke an invite. Only the household OWNER can.
  revoke: householdProcedure
    .input(z.object({ inviteId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.membership.role !== 'OWNER') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only the household owner can revoke invites.',
        });
      }
      const result = await ctx.prisma.invite.updateMany({
        where: {
          id: input.inviteId,
          householdId: input.householdId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
      if (result.count === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Invite not found.' });
      }
      return { id: input.inviteId };
    }),

  // Look up an invite by code. Any signed-in user can — the page that
  // renders the join screen needs it to show "X invited you to Y".
  byCode: protectedProcedure
    .input(z.object({ code: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const invite = await ctx.prisma.invite.findFirst({
        where: { code: input.code, revokedAt: null },
        include: {
          household: { include: { members: { include: { user: true } } } },
          createdBy: true,
        },
      });
      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'This invite link is invalid or has been revoked.',
        });
      }
      return invite;
    }),

  // Accept an invite — adds the current user to the household as MEMBER.
  // Idempotent: silently no-ops for users who are already a member.
  accept: protectedProcedure
    .input(z.object({ code: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.invite.findFirst({
        where: { code: input.code, revokedAt: null },
      });
      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'This invite link is invalid or has been revoked.',
        });
      }

      const existing = await ctx.prisma.householdMember.findUnique({
        where: {
          householdId_userId: {
            householdId: invite.householdId,
            userId: ctx.user.id,
          },
        },
      });
      if (existing) {
        return { householdId: invite.householdId, alreadyMember: true };
      }

      await ctx.prisma.householdMember.create({
        data: {
          householdId: invite.householdId,
          userId: ctx.user.id,
          role: 'MEMBER',
        },
      });
      return { householdId: invite.householdId, alreadyMember: false };
    }),
});
