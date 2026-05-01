import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Ong } from '../../ongs/entities/ong.entity';


@Entity()
export class CollectionPoint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location!: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };

  @ManyToOne(() => Ong, (ong) => ong.id)
  ong!: Ong;
}