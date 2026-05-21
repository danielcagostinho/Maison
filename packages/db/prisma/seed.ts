import { PrismaClient, HouseholdRole, Recurrence } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Wipe in FK-safe order
  await prisma.payment.deleteMany();
  await prisma.billSplit.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.householdMember.deleteMany();
  await prisma.household.deleteMany();
  await prisma.user.deleteMany();

  const [daniel, alice, bob] = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: 'seed_user_daniel',
        email: 'daniel@example.com',
        name: 'Daniel',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'seed_user_alice',
        email: 'alice@example.com',
        name: 'Alice',
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'seed_user_bob',
        email: 'bob@example.com',
        name: 'Bob',
      },
    }),
  ]);

  const household = await prisma.household.create({
    data: {
      name: '123 Main St',
      currency: 'CAD',
      members: {
        create: [
          { userId: daniel.id, role: HouseholdRole.OWNER },
          { userId: alice.id, role: HouseholdRole.MEMBER },
          { userId: bob.id, role: HouseholdRole.MEMBER },
        ],
      },
    },
  });

  // Daniel paid $90 for groceries, split evenly 3 ways = $30 each.
  await prisma.bill.create({
    data: {
      householdId: household.id,
      payerId: daniel.id,
      title: 'Groceries',
      amountCents: 9000,
      occurredAt: new Date(),
      splits: {
        create: [
          { userId: daniel.id, shareCents: 3000 },
          { userId: alice.id, shareCents: 3000 },
          { userId: bob.id, shareCents: 3000 },
        ],
      },
    },
  });

  // Recurring: $1500 rent, monthly, split evenly.
  await prisma.bill.create({
    data: {
      householdId: household.id,
      payerId: daniel.id,
      title: 'Rent',
      amountCents: 150000,
      occurredAt: new Date(),
      recurrence: Recurrence.MONTHLY,
      splits: {
        create: [
          { userId: daniel.id, shareCents: 50000 },
          { userId: alice.id, shareCents: 50000 },
          { userId: bob.id, shareCents: 50000 },
        ],
      },
    },
  });

  // Alice paid Daniel $30 to settle her groceries share.
  await prisma.payment.create({
    data: {
      householdId: household.id,
      fromUserId: alice.id,
      toUserId: daniel.id,
      amountCents: 3000,
      occurredAt: new Date(),
      note: 'groceries',
    },
  });

  console.log(`Seeded household ${household.name} with 3 members, 2 bills, 1 payment.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
