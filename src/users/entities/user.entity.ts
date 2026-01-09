import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

// Enum Definition: กำหนดกลุ่มคำสั่งจำกัด หรือ รายการค่าคงที่ ที่ยอมรับได้
// ในที่นี้กำหนดสิทธิ์ผู้ใช้ (Role) ว่าจะเป็นได้แค่ 'admin' หรือ 'user' เท่านั้น
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

    @Column({ default: false })
    isBlacklisted: boolean;

    @Column({ default: 0 })
    points: number;

    // Usage of Enum: นำ Enum มาใช้กำหนดประเภทของคอลัมน์
    // ระบบจะช่วยตรวจสอบ (Validate) ว่าค่าที่บันทึกต้องเป็น 'admin' หรือ 'user' ตามที่กำหนดไว้เท่านั้น ป้องกันการพิมพ์ผิด
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

    @DeleteDateColumn()
    deletedAt: Date;
}