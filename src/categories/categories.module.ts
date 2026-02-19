import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product]), RolesModule],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
