import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';
import { Cart } from '../cart/cart.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}
