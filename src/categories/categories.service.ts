import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Product } from '../products/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find({
      relations: ['products'],
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    Object.assign(category, dto);

    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    const productsCount = await this.productRepository.count({
      where: { category: { id } },
    });

    if (productsCount > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing products',
      );
    }

    await this.categoryRepository.remove(category);

    return { message: 'Category deleted' };
  }
}
