import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { ProductsRepository } from './products.repository';

@Injectable()
export class PrismaProductsRepository extends ProductsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll() {
    // TODO: Implement findAll
  }

  async findById(id: string) {
    // TODO: Implement findById
  }

  async create(data: any) {
    // TODO: Implement create
  }

  async update(id: string, data: any) {
    // TODO: Implement update
  }

  async delete(id: string) {
    // TODO: Implement delete
  }
}
