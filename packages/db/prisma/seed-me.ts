/**
 * Personal seed: finds the most-recent real (Clerk-backed) user in the DB
 * and builds a fully-populated household around them — three fake
 * housemates, a mix of one-off and recurring bills with realistic
 * payers/splits, and a couple of settle-up payments.
 *
 * Idempotent: re-running cleans up its own previous output (the household
 * named below) and recreates it. Your real User row is left alone.
 *
 * Run: pnpm db:seed:me
 */
import { PrismaClient, HouseholdRole, Recurrence } from '@prisma/client';

const prisma = new PrismaClient();

const HOUSEHOLD_NAME = '456 Oak St';
const HOUSEMATES = [
  { clerkId: 'seed_personal_alice', email: 'alice@oak.test', name: 'Alice Cooper' },
  { clerkId: 'seed_personal_bob', email: 'bob@oak.test', name: 'Bob Belcher' },
  { clerkId: 'seed_personal_chloe', email: 'chloe@oak.test', name: 'Chloe Frazer' },
];

async function main() {
  const me = await prisma.user.findFirst({
    where: { NOT: { clerkId: { startsWith: 'seed_' } } },
    orderBy: { createdAt: 'desc' },
  });

  if (!me) {
    console.error(
      'No real user found. Sign in to the web app at least once so a User row exists, then re-run.',
    );
    process.exit(1);
  }

  console.log(`Seeding personal data for ${me.name} <${me.email}>`);

  // Clean up any previous run.
  await prisma.household.deleteMany({ where: { name: HOUSEHOLD_NAME } });

  // Upsert the fake housemates (cheap — they may already exist).
  const housemates = await Promise.all(
    HOUSEMATES.map((h) =>
      prisma.user.upsert({ where: { clerkId: h.clerkId }, update: {}, create: h }),
    ),
  );
  const [alice, bob, chloe] = housemates as [
    (typeof housemates)[number],
    (typeof housemates)[number],
    (typeof housemates)[number],
  ];

  const household = await prisma.household.create({
    data: {
      name: HOUSEHOLD_NAME,
      currency: 'CAD',
      members: {
        create: [
          { userId: me.id, role: HouseholdRole.OWNER },
          { userId: alice.id, role: HouseholdRole.MEMBER },
          { userId: bob.id, role: HouseholdRole.MEMBER },
          { userId: chloe.id, role: HouseholdRole.MEMBER },
        ],
      },
    },
  });

  const everyone = [me, alice, bob, chloe];
  function evenSplit(totalCents: number) {
    const base = Math.floor(totalCents / everyone.length);
    const remainder = totalCents - base * everyone.length;
    return everyone.map((u, i) => ({
      userId: u.id,
      shareCents: base + (i < remainder ? 1 : 0),
    }));
  }
  function daysAgo(n: number) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  }

  type BillSpec = {
    payer: { id: string };
    title: string;
    amountCents: number;
    daysAgo: number;
    recurrence?: Recurrence;
  };
  const bills: BillSpec[] = [
    { payer: me, title: 'Rent — May', amountCents: 240000, daysAgo: 21, recurrence: Recurrence.MONTHLY },
    { payer: alice, title: 'Costco run', amountCents: 18745, daysAgo: 14 },
    { payer: bob, title: 'Wifi — May', amountCents: 8000, daysAgo: 12, recurrence: Recurrence.MONTHLY },
    { payer: me, title: 'Hydro — May', amountCents: 11240, daysAgo: 10, recurrence: Recurrence.MONTHLY },
    { payer: chloe, title: 'Pizza night', amountCents: 4250, daysAgo: 6 },
    { payer: alice, title: 'Cleaning supplies', amountCents: 3215, daysAgo: 4 },
    { payer: me, title: 'Groceries', amountCents: 15680, daysAgo: 2 },
  ];

  for (const b of bills) {
    await prisma.bill.create({
      data: {
        householdId: household.id,
        payerId: b.payer.id,
        title: b.title,
        amountCents: b.amountCents,
        occurredAt: daysAgo(b.daysAgo),
        recurrence: b.recurrence ?? Recurrence.NONE,
        splits: { create: evenSplit(b.amountCents) },
      },
    });
  }

  await prisma.payment.create({
    data: {
      householdId: household.id,
      fromUserId: bob.id,
      toUserId: me.id,
      amountCents: 30000,
      occurredAt: daysAgo(18),
      note: 'rent + utilities catchup',
    },
  });
  await prisma.payment.create({
    data: {
      householdId: household.id,
      fromUserId: chloe.id,
      toUserId: alice.id,
      amountCents: 5000,
      occurredAt: daysAgo(5),
      note: 'costco',
    },
  });

  console.log(
    `Seeded "${HOUSEHOLD_NAME}" — 4 members, ${bills.length} bills, 2 payments.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
