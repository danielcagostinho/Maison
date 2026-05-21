import { router } from './trpc.js';
import { billRouter } from './routers/bill.js';
import { householdRouter } from './routers/household.js';
import { paymentRouter } from './routers/payment.js';
import { settlementRouter } from './routers/settlement.js';
import { userRouter } from './routers/user.js';

export const appRouter = router({
  user: userRouter,
  household: householdRouter,
  bill: billRouter,
  payment: paymentRouter,
  settlement: settlementRouter,
});

export type AppRouter = typeof appRouter;

export type { Context, CreateContextOptions, AuthContext } from './context.js';
export { createContext } from './context.js';
