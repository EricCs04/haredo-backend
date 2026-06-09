import { Role } from '@/auth/role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('ongs')
export class Ong {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  // ✔ agora opcional para permitir ONG_VALIDATOR
  @Index({ unique: true })
  @Column({ nullable: true })
  cnpj?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  // PostGIS location
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ONG_ADMIN,
  })
  role!: Role;

  // 👇 Hierarquia ONG -> Validators
  @ManyToOne(() => Ong, (parent) => parent.validators, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parentOng?: Ong;

  @OneToMany(() => Ong, (child) => child.parentOng)
  validators!: Ong[];
}