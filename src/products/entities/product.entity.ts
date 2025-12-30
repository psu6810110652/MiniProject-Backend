import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    product_id: string;

    @Column()
    name: string;

    @Column('decimal')
    price: number;

    @Column('int')
    stock_qty: number;

    @Column()
    category_id: string;

    @Column()
    supplier_id: string;

    @Column({ nullable: true })
    campaign_id?: string;
}