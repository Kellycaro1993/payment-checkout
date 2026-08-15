import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class DeliveriesRepository {
  public abstract findById(id: number): Promise<any>;

  public abstract create(data: any): Promise<any>;
}