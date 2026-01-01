import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    order_id: string;

    @CreateDateColumn()
    order_date: Date;

    @Column('decimal')
    total_amount: number;

    @Column('decimal')
    shipping_fee: number;

    @Column()
    payment_status: string;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
}