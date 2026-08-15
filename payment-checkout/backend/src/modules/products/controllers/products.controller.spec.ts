import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: Mocked<ProductsService>;

  beforeEach(async () => {
    const mockProductsService = {
      getProducts: jest.fn(),
      getProductById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get(ProductsService) as Mocked<ProductsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const products = [
        {
          id: 1,
          name: 'Product 1',
          price: 100,
          description: 'Description 1',
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Product 2',
          price: 200,
          description: 'Description 2',
          stock: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      service.getProducts.mockResolvedValue(products);

      const result = await controller.getProducts();

      expect(result).toEqual(products);
      expect(service.getProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const productId = 1;
      const product = {
        id: productId,
        name: 'Product 1',
        price: 100,
        description: 'Description 1',
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.getProductById.mockResolvedValue(product);

      const result = await controller.getProductById(productId);

      expect(result).toEqual(product);
      expect(service.getProductById).toHaveBeenCalledWith(productId);
      expect(service.getProductById).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid product id', async () => {
      const productId = 999;

      service.getProductById.mockResolvedValue(null);

      const result = await controller.getProductById(productId);

      expect(result).toBeNull();
      expect(service.getProductById).toHaveBeenCalledWith(productId);
    });
  });
});
});
