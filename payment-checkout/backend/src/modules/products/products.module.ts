import { Module } from '@nestjs/common';
import { ProductsRepository } from './repositories/products.repository';
import { PrismaProductsRepository } from './repositories/prisma-products.repository';
import { ProductsService } from './services/products.service';

@Module({
  providers: [
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    ProductsService,
  ],
  exports: [ProductsRepository],
})
export class ProductsModule {}