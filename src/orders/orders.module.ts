import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { CartModule } from 'src/cart/cart.module';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User]), CartModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
