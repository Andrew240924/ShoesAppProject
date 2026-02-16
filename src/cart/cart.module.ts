import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
