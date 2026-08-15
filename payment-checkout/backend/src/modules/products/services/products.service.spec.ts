import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';
import { ProductsService } from './products.service';
import { ProductsRepository } from '../repositories/products.repository';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Mocked<ProductsRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(ProductsRepository) as Mocked<ProductsRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
