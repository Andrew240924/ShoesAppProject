import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/users.entity';

describe('CartService (unit)', () => {
  let service: CartService;

  const cartRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const cartItemRepo = {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  const productRepo = {
    findOne: jest.fn(),
  };

  const userRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getRepositoryToken(Cart), useValue: cartRepo },
        { provide: getRepositoryToken(CartItem), useValue: cartItemRepo },
        { provide: getRepositoryToken(Product), useValue: productRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get(CartService);
  });

  it('addToCart: throws BadRequestException when stock is not enough', async () => {
    productRepo.findOne.mockResolvedValue({ id: 5, stock: 1 });

    await expect(
      service.addToCart(1, { productId: 5, quantity: 2 }),
    ).rejects.toBeInstanceOf(BadRequestException);

    // На ошибке по остатку не должно быть попыток сохранить позиции корзины
    expect(cartItemRepo.save).not.toHaveBeenCalled();
  });
});
