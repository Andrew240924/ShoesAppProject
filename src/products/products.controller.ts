import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Создание вариации
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // Все модели (сгруппированные)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Одна модель + все её вариации
  @Get(':groupId')
  findOne(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.productsService.findOne(groupId);
  }

  // Вариации модели по цвету (только доступные размеры)
  @Get(':groupId/:color')
  findByGroupAndColor(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('color') color: string,
  ) {
    return this.productsService.findByGroupAndColor(groupId, color);
  }

  // Обновление конкретной вариации
  @Patch('variant/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  // Удаление конкретной вариации
  @Delete('variant/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
