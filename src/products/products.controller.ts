import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleName } from '../roles/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Создание вариации (ADMIN)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // Все модели (сгруппированные) — публично
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Одна модель + все её вариации — публично
  @Get(':groupId')
  findOne(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.productsService.findOne(groupId);
  }

  // Вариации модели по цвету (только доступные размеры) — публично
  @Get(':groupId/:color')
  findByGroupAndColor(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('color') color: string,
  ) {
    return this.productsService.findByGroupAndColor(groupId, color);
  }

  // Обновление конкретной вариации (ADMIN)
  @Patch('variant/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  // Удаление конкретной вариации (ADMIN)
  @Delete('variant/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
