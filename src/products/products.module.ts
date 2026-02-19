import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), RolesModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
