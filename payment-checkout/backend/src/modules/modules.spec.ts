import { describe, expect, it } from '@jest/globals';
import { AppModule } from '../app.module';
import { PrismaModule } from '../infrastructure/database/prisma/prisma.module';
import { PaymentModule } from '../infrastructure/integrations/payment/payment.module';
import { CustomersModule } from './customers/customers.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';

describe('Application modules', () => {
  it('declara los módulos principales de la aplicación', () => {
    expect(AppModule).toBeDefined();
    expect(PrismaModule).toBeDefined();
    expect(PaymentModule).toBeDefined();
    expect(CustomersModule).toBeDefined();
    expect(DeliveriesModule).toBeDefined();
    expect(ProductsModule).toBeDefined();
    expect(TransactionsModule).toBeDefined();
  });
});
