import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  await prisma.transactionItem.deleteMany();
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

  const customer = await prisma.customer.create({
    data: {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '3001234567',
    },
  });

  await prisma.delivery.create({
    data: {
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      customerId: customer.id,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Wireless Headphones',
        description:
          'Bluetooth wireless headphones with noise cancellation.',
        price: 189900,
        stock: 15,
      },
      {
        name: 'Mechanical Keyboard',
        description:
          'Mechanical keyboard with RGB backlight.',
        price: 249900,
        stock: 10,
      },
      {
        name: 'Smart Watch',
        description:
          'Smart watch with health and fitness tracking.',
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