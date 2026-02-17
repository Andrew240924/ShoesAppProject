import { Injectable } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addToCart(userId: number, dto: AddToCartDto) {
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock');
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      cart = this.cartRepository.create({ user });
      cart = await this.cartRepository.save(cart);
    }

    const existingItem = cart.items.find(
      (item) => item.product.id === dto.productId,
    );

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      return await this.cartItemRepository.save(existingItem);
    }

    const cartItem = this.cartItemRepository.create({
      cart,
      product,
      quantity: dto.quantity,
    });

    return await this.cartItemRepository.save(cartItem);
  }

  async getCart(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    let totalItems = 0;
    let totalPrice = 0;

    const items = cart.items.map((item) => {
      const itemTotal = Number(item.product.price) * item.quantity;

      totalItems += item.quantity;
      totalPrice += itemTotal;

      return {
        itemId: item.id,
        productId: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
        total: itemTotal,
      };
    });

    return {
      id: cart.id,
      items,
      totalItems,
      totalPrice,
    };
  }

  async updateQuantity(userId: number, itemId: number, quantity: number) {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id: itemId,
        cart: { user: { id: userId } },
      },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity > cartItem.product.stock) {
      throw new BadRequestException('Not enough stock');
    }

    cartItem.quantity = quantity;

    await this.cartItemRepository.save(cartItem);

    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        id: itemId,
        cart: { user: { id: userId } },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);

    return this.getCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!cart) return;

    await this.cartItemRepository.delete({
      cart: { id: cart.id } as any,
    });
  }

}
