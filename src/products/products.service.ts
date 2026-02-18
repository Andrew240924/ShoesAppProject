import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // ✅ Создание конкретной вариации
  async create(dto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productRepository.create({
      groupId: dto.groupId,
      name: dto.name,
      brand: dto.brand,
      image: dto.image,
      price: dto.price,
      color: dto.color,
      size: dto.size,
      stock: dto.stock,
      category,
    });

    return await this.productRepository.save(product);
  }

  // ✅ Получить все модели (сгруппированные)
  async findAll() {
    const products = await this.productRepository.find({
      relations: ['category'],
      order: { groupId: 'ASC' },
    });

    const grouped: Record<number, any> = {};

    for (const product of products) {
      const key = product.groupId;

      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: product.price,
          category: product.category?.name,
          colors: new Set<string>(),
          sizes: new Set<number>(),
          totalStock: 0,
        };
      }

      grouped[key].colors.add(product.color);
      grouped[key].sizes.add(product.size);
      grouped[key].totalStock += product.stock;
    }

    return Object.values(grouped).map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      image: item.image,
      price: item.price,
      category: item.category,
      color: Array.from(item.colors),
      size: Array.from(item.sizes),
      stock: item.totalStock,
    }));
  }

  // ✅ Получить одну модель + все её вариации
  async findOne(groupId: number) {
    const variants = await this.productRepository.find({
      where: { groupId },
      relations: ['category'],
    });

    if (!variants.length) {
      throw new NotFoundException('Product not found');
    }

    const first = variants[0];

    return {
      id: groupId,
      name: first.name,
      brand: first.brand,
      image: first.image,
      price: first.price,
      category: first.category?.name,
      variants: variants.map(v => ({
        id: v.id,
        color: v.color,
        size: v.size,
        stock: v.stock,
      })),
    };
  }

  // ✅ Обновление конкретной вариации
  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product variant not found');
    }

    Object.assign(product, dto);

    return await this.productRepository.save(product);
  }

  // ✅ Удаление конкретной вариации
  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product variant not found');
    }

    await this.productRepository.remove(product);

    return { message: 'Product variant deleted' };
  }
}
