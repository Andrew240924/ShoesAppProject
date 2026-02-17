import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private cartService: CartService,
  ) {}

  async createOrder(userId: number) {
    const cartData = await this.cartService.getCart(userId);

    if (!cartData.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 1️⃣ Считаем total
    let total = 0;
    for (const item of cartData.items) {
      total += Number(item.price) * item.quantity;
    }

    // 2️⃣ Создаём заказ
    const order = this.orderRepo.create({
      user,
      total_price: total,
      status: 'CREATED',
    });

    const savedOrder = await this.orderRepo.save(order);

    // 3️⃣ Обрабатываем товары
    for (const item of cartData.items) {
      const product = await this.productRepo.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException('Not enough stock');
      }

      product.stock = product.stock - item.quantity;
      await this.productRepo.save(product);

      const orderItem = this.orderItemRepo.create({
        order: savedOrder,
        product,
        quantity: item.quantity,
        price_at_purchase: product.price,
      });

      await this.orderItemRepo.save(orderItem);
    }

    // 4️⃣ Очищаем корзину
    await this.cartService.clearCart(userId);

    return savedOrder;
  }



  async getMyOrders(userId: number) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { id: 'DESC' },
    });
  }
}
