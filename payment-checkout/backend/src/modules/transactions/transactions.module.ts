import { Module } from '@nestjs/common';
import { TransactionsRepository } from './repositories/transactions.repository';
import { PrismaTransactionsRepository } from './repositories/prisma-transactions.repository';

@Module({
  providers: [
    {
      provide: TransactionsRepository,
      useClass: PrismaTransactionsRepository,
    },
  ],
  exports: [TransactionsRepository],
})
export class TransactionsModule {}