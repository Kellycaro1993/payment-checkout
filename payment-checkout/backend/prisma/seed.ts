import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
    await prisma.transaction.deleteMany();
    await prisma.delivery.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.product.deleteMany();
    await prisma.transactionStatus.deleteMany();
    await prisma.transactionStatus.createMany({
        data: [
        { id: 1, name: 'PENDING' },
        { id: 2, name: 'APPROVED' },
        { id: 3, name: 'DECLINED' },
        { id: 4, name: 'ERROR' },
        ],
    });

  await prisma.product.createMany({
    data: [
      {
        name: 'Wireless Headphones',
        description: 'Bluetooth wireless headphones with noise cancellation.',
        price: 189900,
        stock: 15,
      },
      {
        name: 'Mechanical Keyboard',
        description: 'Mechanical keyboard with RGB backlight.',
        price: 249900,
        stock: 10,
      },
      {
        name: 'Smart Watch',
        description: 'Smart watch with health and fitness tracking.',
        price: 329900,
        stock: 8,
      },
    ],
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });