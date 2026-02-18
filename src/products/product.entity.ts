import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  // Группировка модели
  @Column()
  groupId: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  image: string;

  @Column('decimal')
  price: number;

  // Конкретный цвет этой вариации
  @Column()
  color: string;

  // Конкретный размер этой вариации
  @Column()
  size: number;

  // Количество пар именно этой вариации
  @Column()
  stock: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  category: Category;
}
