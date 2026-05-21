import type { Cents } from './money';

export interface BillLike {
  payerId: string;
  splits: Array<{ userId: string; shareCents: Cents }>;
}

export interface PaymentLike {
  fromUserId: string;
  toUserId: string;
  amountCents: Cents;
}

// Net balance per user across a household.
// > 0  = they are owed money
// < 0  = they owe money
// = 0  = settled
export function computeBalances(
  bills: BillLike[],
  payments: PaymentLike[],
): Map<string, Cents> {
  const balances = new Map<string, Cents>();
  const add = (userId: string, delta: Cents) =>
    balances.set(userId, (balances.get(userId) ?? 0) + delta);

  for (const bill of bills) {
    for (const split of bill.splits) {
      // The payer fronted this share; everyone else owes their share to them.
      if (split.userId === bill.payerId) continue;
      add(bill.payerId, split.shareCents);
      add(split.userId, -split.shareCents);
    }
  }

  for (const payment of payments) {
    // A payment reduces the sender's debt and the receiver's credit.
    add(payment.fromUserId, payment.amountCents);
    add(payment.toUserId, -payment.amountCents);
  }

  return balances;
}

export interface SettlementTransfer {
  fromUserId: string;
  toUserId: string;
  amountCents: Cents;
}

// Given net balances, produce a minimal-ish list of transfers that
// settles everyone to zero. Uses a greedy match: largest debtor pays
// largest creditor each step. This is not provably optimal in the
// general case but is within ~1 of optimal and runs in O(n log n).
export function suggestSettlements(balances: Map<string, Cents>): SettlementTransfer[] {
  const creditors: Array<{ userId: string; amountCents: Cents }> = [];
  const debtors: Array<{ userId: string; amountCents: Cents }> = [];

  for (const [userId, balance] of balances) {
    if (balance > 0) creditors.push({ userId, amountCents: balance });
    else if (balance < 0) debtors.push({ userId, amountCents: -balance });
  }

  creditors.sort((a, b) => b.amountCents - a.amountCents);
  debtors.sort((a, b) => b.amountCents - a.amountCents);

  const transfers: SettlementTransfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]!;
    const creditor = creditors[j]!;
    const amount = Math.min(debtor.amountCents, creditor.amountCents);

    transfers.push({
      fromUserId: debtor.userId,
      toUserId: creditor.userId,
      amountCents: amount,
    });

    debtor.amountCents -= amount;
    creditor.amountCents -= amount;

    if (debtor.amountCents === 0) i++;
    if (creditor.amountCents === 0) j++;
  }

  return transfers;
}
