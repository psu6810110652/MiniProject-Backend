import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories') // Table name in PostgreSQL
export class Category {
    @PrimaryGeneratedColumn('uuid')
    category_id: string;

    @Column({ unique: true }) // Category names should be unique
    category_name: string;
}
