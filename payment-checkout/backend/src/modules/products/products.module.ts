import { Module } from '@nestjs/common';
import { ProductsRepository } from './repositories/products.repository';
import { PrismaProductsRepository } from './repositories/prisma-products.repository';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';
@Module({
  providers: [
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    ProductsService, 
  ],
  exports: [ProductsRepository],
  controllers: [ProductsController],
  imports: [
    PrismaModule,
    ProductsModule,
  ],
})
export class ProductsModule {}