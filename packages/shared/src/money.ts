// All amounts are stored as integer cents. These helpers convert at the
// display boundary; nothing else in the app should do floating-point math
// on currency.

export type Cents = number;

export function centsToDecimal(cents: Cents): number {
  return cents / 100;
}

export function decimalToCents(amount: number): Cents {
  return Math.round(amount * 100);
}

export function formatMoney(cents: Cents, currency = 'CAD', locale = 'en-CA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(centsToDecimal(cents));
}

// Split a total into N shares as evenly as possible, distributing the
// remainder pennies to the first `remainder` shares. Guarantees the sum
// of returned shares equals `total` exactly.
export function splitEvenly(total: Cents, n: number): Cents[] {
  if (n <= 0) throw new Error('splitEvenly: n must be > 0');
  const base = Math.floor(total / n);
  const remainder = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}
