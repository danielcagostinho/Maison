import { CreatePaymentInput } from '@maison/shared';

import { householdProcedure, router } from '../trpc.js';

export const paymentRouter = router({
  list: householdProcedure.query(({ ctx, input }) =>
    ctx.prisma.payment.findMany({
      where: { householdId: input.householdId },
      include: { from: true, to: true },
      orderBy: { occurredAt: 'desc' },
    }),
  ),

  create: householdProcedure.input(CreatePaymentInput).mutation(({ ctx, input }) =>
    ctx.prisma.payment.create({
      data: input,
    }),
  ),
});
