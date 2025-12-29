import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // Hash password

  @Column({ default: 'USER' })
  role: 'ADMIN' | 'USER';

  @OneToMany(() => Order, (order: Order) => order.user)
  orders: Order[];
}