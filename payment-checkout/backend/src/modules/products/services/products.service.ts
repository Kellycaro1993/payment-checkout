import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

  async getProducts() {
    return this.productsRepository.findAll();
  }

  async getProductById(id: number) {
    return this.productsRepository.findById(id);
  }
}