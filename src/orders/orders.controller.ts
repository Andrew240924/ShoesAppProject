import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload) {
    return this.ordersService.createOrder(user.sub);
  }

  @Get()
  myOrders(@CurrentUser() user: JwtPayload) {
    return this.ordersService.getMyOrders(user.sub);
  }
}
