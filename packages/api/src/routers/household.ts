import { CreateHouseholdInput } from '@maison/shared';

import { householdProcedure, protectedProcedure, router } from '../trpc';

export const householdRouter = router({
  // All households the current user belongs to.
  list: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.household.findMany({
      where: { members: { some: { userId: ctx.user.id } } },
      orderBy: { createdAt: 'desc' },
    }),
  ),

  // One household with members (current user must be a member).
  get: householdProcedure.query(({ ctx, input }) =>
    ctx.prisma.household.findUniqueOrThrow({
      where: { id: input.householdId },
      include: { members: { include: { user: true } } },
    }),
  ),

  // Create a household; the creator becomes the owner.
  create: protectedProcedure
    .input(CreateHouseholdInput)
    .mutation(({ ctx, input }) =>
      ctx.prisma.household.create({
        data: {
          name: input.name,
          currency: input.currency,
          members: { create: { userId: ctx.user.id, role: 'OWNER' } },
        },
      }),
    ),
});
