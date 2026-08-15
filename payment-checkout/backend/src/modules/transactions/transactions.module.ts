import { Module } from '@nestjs/common';
import { TransactionsRepository } from './repositories/transactions.repository';
import { PrismaTransactionsRepository } from './repositories/prisma-transactions.repository';
import { PaymentModule } from '../../infrastructure/integrations/payment/payment.module';
@Module({
    imports: [PaymentModule],
    providers: [
        {
        provide: TransactionsRepository,
        useClass: PrismaTransactionsRepository,
        },
    ],
    exports: [TransactionsRepository],
})
export class TransactionsModule {}