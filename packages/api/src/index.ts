import { router } from './trpc';
import { billRouter } from './routers/bill';
import { householdRouter } from './routers/household';
import { paymentRouter } from './routers/payment';
import { settlementRouter } from './routers/settlement';
import { userRouter } from './routers/user';

export const appRouter = router({
  user: userRouter,
  household: householdRouter,
  bill: billRouter,
  payment: paymentRouter,
  settlement: settlementRouter,
});

export type AppRouter = typeof appRouter;

export type { Context, CreateContextOptions, AuthContext } from './context';
export { createContext } from './context';
