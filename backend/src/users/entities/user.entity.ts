import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { Requirement } from '../../requirements/entities/requirement.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true, name: 'user_handle' })
  userHandle: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, name: 'whatsapp_number' })
  whatsappNumber: string;

  @Column({ default: 'agent' })
  role: string; // agent, broker, admin

  @Column({ nullable: true })
  license: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ type: 'text', array: true, nullable: true })
  specialties: string[];

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @OneToMany(() => Property, property => property.user)
  properties: Property[];

  @OneToMany(() => Requirement, requirement => requirement.user)
  requirements: Requirement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

