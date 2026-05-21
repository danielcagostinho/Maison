import { z } from 'zod';

const cuid = z.string().min(1);
const cents = z.number().int().nonnegative();

export const HouseholdRoleSchema = z.enum(['OWNER', 'MEMBER']);
export const RecurrenceSchema = z.enum(['NONE', 'WEEKLY', 'MONTHLY']);

export const CreateHouseholdInput = z.object({
  name: z.string().min(1).max(80),
  currency: z.string().length(3).default('CAD'),
});
export type CreateHouseholdInput = z.infer<typeof CreateHouseholdInput>;

export const CreateBillInput = z
  .object({
    householdId: cuid,
    payerId: cuid,
    title: z.string().min(1).max(120),
    amountCents: cents.positive(),
    occurredAt: z.coerce.date(),
    recurrence: RecurrenceSchema.default('NONE'),
    splits: z
      .array(z.object({ userId: cuid, shareCents: cents }))
      .min(1),
  })
  .refine(
    (b) => b.splits.reduce((sum, s) => sum + s.shareCents, 0) === b.amountCents,
    { message: 'Sum of split shares must equal bill amount', path: ['splits'] },
  );
export type CreateBillInput = z.infer<typeof CreateBillInput>;

export const CreatePaymentInput = z
  .object({
    householdId: cuid,
    fromUserId: cuid,
    toUserId: cuid,
    amountCents: cents.positive(),
    occurredAt: z.coerce.date(),
    note: z.string().max(280).optional(),
  })
  .refine((p) => p.fromUserId !== p.toUserId, {
    message: 'fromUserId and toUserId must differ',
    path: ['toUserId'],
  });
export type CreatePaymentInput = z.infer<typeof CreatePaymentInput>;
