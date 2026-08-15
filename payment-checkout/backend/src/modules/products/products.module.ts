import { Module } from '@nestjs/common';
import { ProductsRepository } from './repositories/products.repository';
import { PrismaProductsRepository } from './repositories/prisma-products.repository';

@Module({
  providers: [
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
  exports: [ProductsRepository],
})
export class ProductsModule {}