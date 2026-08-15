import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ProductsRepository {
  abstract findAll();
  abstract findById(id: string);
  abstract create(data: any);
  abstract update(id: string, data: any);
  abstract delete(id: string);
}
