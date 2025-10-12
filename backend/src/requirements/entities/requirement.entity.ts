import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('requirements')
export class Requirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  requirement: string;

  @Column({ nullable: true, name: 'property_type' })
  propertyType: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  budget: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  replies: number;

  @ManyToOne(() => User, user => user.requirements)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

