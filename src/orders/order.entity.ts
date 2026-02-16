import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('decimal')
  total_price: number;

  @Column()
  status: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}