import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
 
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
 
  @Column()
  name!: string;
 
  @Index({ unique: true })
  @Column()
  email!: string;
 
  @Column({ name: 'password_hash' })
  passwordHash!: string;
 
  @Column({ nullable: true })
  phone!: string;
 
  @Column({ nullable: true })
  address!: string;
 
  // Ponto geográfico para busca por proximidade (PostGIS)
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location!: string;
 
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
 
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}