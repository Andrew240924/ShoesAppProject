import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
