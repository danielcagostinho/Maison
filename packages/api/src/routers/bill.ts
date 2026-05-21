import { CreateBillInput } from '@maison/shared';
import { z } from 'zod';

import { householdProcedure, router } from '../trpc.js';

export const billRouter = router({
  list: householdProcedure.query(({ ctx, input }) =>
    ctx.prisma.bill.findMany({
      where: { householdId: input.householdId, parentBillId: null },
      include: { payer: true, splits: { include: { user: true } } },
      orderBy: { occurredAt: 'desc' },
    }),
  ),

  get: householdProcedure
    .input(z.object({ billId: z.string().min(1) }))
    .query(({ ctx, input }) =>
      ctx.prisma.bill.findFirstOrThrow({
        where: { id: input.billId, householdId: input.householdId },
        include: { payer: true, splits: { include: { user: true } } },
      }),
    ),

  create: householdProcedure.input(CreateBillInput).mutation(({ ctx, input }) =>
    ctx.prisma.bill.create({
      data: {
        householdId: input.householdId,
        payerId: input.payerId,
        title: input.title,
        amountCents: input.amountCents,
        occurredAt: input.occurredAt,
        recurrence: input.recurrence,
        splits: { create: input.splits },
      },
      include: { splits: true },
    }),
  ),
});
