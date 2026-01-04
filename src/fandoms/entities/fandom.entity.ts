import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('fandoms')
export class Fandom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  banner_image: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  product_count: number;

  @Column({ default: 0 })
  member_count: number;

  @Column({ type: 'enum', enum: ['anime', 'movie', 'game', 'book', 'comic', 'other'], default: 'other' })
  category: string;

  @Column({ type: 'text', nullable: true })
  tags: string | null; // JSON string of tags array

  @ManyToOne(() => User)
  creator: User;

  @Column()
  creator_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
