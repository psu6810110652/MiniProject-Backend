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

    @Column({ type: 'text', nullable: true })
    image: string;

    @Column({ nullable: true })
    fandom: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: false })
    is_preorder: boolean;

    @Column('decimal', { nullable: true })
    deposit_amount: number;

    @Column({ nullable: true })
    release_date: string;

    @Column({ type: 'text', nullable: true })
    gallery: string; // Storing as JSON string for compatibility or simple-array if postgres
}