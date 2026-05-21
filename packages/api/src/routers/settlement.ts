import { computeBalances, suggestSettlements } from '@maison/shared';

import { householdProcedure, router } from '../trpc';

export const settlementRouter = router({
  // Net balance per member + suggested settle-up transfers.
  forHousehold: householdProcedure.query(async ({ ctx, input }) => {
    const [bills, payments, members] = await Promise.all([
      ctx.prisma.bill.findMany({
        where: { householdId: input.householdId, parentBillId: null },
        select: { payerId: true, splits: { select: { userId: true, shareCents: true } } },
      }),
      ctx.prisma.payment.findMany({
        where: { householdId: input.householdId },
        select: { fromUserId: true, toUserId: true, amountCents: true },
      }),
      ctx.prisma.householdMember.findMany({
        where: { householdId: input.householdId },
        include: { user: true },
      }),
    ]);

    const balances = computeBalances(bills, payments);
    const transfers = suggestSettlements(balances);

    return {
      balances: members.map((m) => ({
        user: m.user,
        netCents: balances.get(m.userId) ?? 0,
      })),
      transfers,
    };
  }),
});
