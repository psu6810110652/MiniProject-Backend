import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    item_id: string;

    @Column()
    product_id: string;

    @Column('int')
    quantity: number;

    @Column('decimal')
    unit_price: number;

    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column()
    order_id: string;
}

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

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
}