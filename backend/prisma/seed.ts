import { PrismaClient, UserStatus } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

const seedUser = {
  email: 'khair.solutionspin@gmail.com',
  password: 'Password@1234',
  firstName: 'Khair',
  lastName: 'Solutionspin',
  status: UserStatus.ACTIVE,
} as const;

async function main() {
  const passwordHash = await hashPassword(seedUser.password);

  const user = await prisma.user.upsert({
    where: { email: seedUser.email },
    update: {
      passwordHash,
      firstName: seedUser.firstName,
      lastName: seedUser.lastName,
      status: seedUser.status,
      deletedAt: null,
    },
    create: {
      email: seedUser.email,
      passwordHash,
      firstName: seedUser.firstName,
      lastName: seedUser.lastName,
      status: seedUser.status,
    },
  });

  console.log(`Seeded user: ${user.email} (${user.id})`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
