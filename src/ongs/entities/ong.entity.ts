import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
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
 
  @Index({ unique: true })
  @Column()
  cnpj!: string;
 
  @Column({ nullable: true, type: 'text' })
  description!: string;
 
  @Column({ nullable: true })
  address!: string;
 
  @Column({ nullable: true })
  phone!: string;
 
  // Localização da ONG para buscas geográficas (PostGIS)
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