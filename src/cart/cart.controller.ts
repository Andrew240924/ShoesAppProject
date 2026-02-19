import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // 📦 Получить корзину
  @Get()
  getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCart(user.id);
  }

  // ➕ Добавить товар
  @Post()
  addToCart(@Body() dto: AddToCartDto, @CurrentUser() user: JwtPayload) {
    return this.cartService.addToCart(user.id, dto);
  }

  // 🔄 Изменить количество
  @Patch('quantity')
  updateQuantity(
    @Body() dto: UpdateCartItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.cartService.updateQuantity(user.id, dto.productId, dto.quantity);
  }

  // ❌ Удалить товар
  @Delete('item/:productId')
  removeItem(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.cartService.removeItem(user.id, productId);
  }
}
