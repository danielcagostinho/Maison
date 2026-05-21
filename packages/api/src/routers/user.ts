import { z } from 'zod';

import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
  me: protectedProcedure.query(({ ctx }) => ctx.user),

  // Pushes the authoritative Clerk profile (email, name, avatar) into our
  // User row. Web/mobile clients call this on sign-in so subsequent reads
  // see the right profile.
  syncFromClerk: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
        avatarUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
      });
    }),
});
