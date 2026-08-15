import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.getProductById(id);
  }
}
