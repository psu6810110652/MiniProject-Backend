import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    address: string; // Keep specifically for full string if needed, or legacy

    @Column({ nullable: true })
    house_number: string;

    @Column({ nullable: true })
    sub_district: string;

    @Column({ nullable: true })
    district: string;

    @Column({ nullable: true })
    province: string;

    @Column({ nullable: true })
    postal_code: string;

    @Column({ nullable: true })
    facebook: string;

    @Column({ nullable: true })
    twitter: string;

    @Column({ nullable: true })
    line: string;

    @Column({ nullable: true })
    facebookName: string;

    @Column({ nullable: true })
    twitterName: string;

    @Column({ nullable: true })
    lineName: string;

    @Column({ default: 0 })
    points: number;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column()
    password: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}