import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image_url: string;

  @Column('decimal')
  price: number;

  @Column()
  goal: number; // เป้าหมายยอดจอง

  @Column({ default: 0 })
  current: number; // ยอดจองปัจจุบัน (จะถูกอัปเดตอัตโนมัติ)

  @Column()
  endDate: Date; // วันปิดพรี

  @OneToMany(() => Order, (order: Order) => order.campaign)
  orders: Order[];
}