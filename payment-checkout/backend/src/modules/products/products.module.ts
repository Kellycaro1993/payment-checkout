import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { PrismaProductsRepository } from './repositories/prisma-products.repository';
import { ProductsRepository } from './repositories/products.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
})
export class ProductsModule {}
