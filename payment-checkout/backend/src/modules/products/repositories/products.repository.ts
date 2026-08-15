import { Product } from '../../../../generated/prisma/client';

export abstract class ProductsRepository {
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: number): Promise<Product | null>;
  abstract updateStock(id: number, quantity: number): Promise<Product>;
}