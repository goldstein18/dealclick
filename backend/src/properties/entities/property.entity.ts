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

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  price: string;

  @Column()
  location: string;

  @Column({ name: 'property_type' })
  propertyType: string; // Casa, Departamento, Oficina, etc.

  @Column({ type: 'text', array: true })
  images: string[];

  @Column({ nullable: true })
  beds: number;

  @Column({ nullable: true })
  baths: number;

  @Column({ nullable: true })
  area: number;

  @Column({ nullable: true })
  parking: number;

  @Column({ nullable: true, name: 'year_built' })
  yearBuilt: number;

  @Column({ default: 'En Venta' })
  status: string;

  @Column({ type: 'text', array: true, nullable: true })
  amenities: string[];

  @Column({ type: 'text', array: true, nullable: true })
  features: string[];

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  hidden: boolean;

  @ManyToOne(() => User, user => user.properties)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

