import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ong } from '../../ongs/entities/ong.entity';
import { Need } from '../../needs/entities/need.entity';
import { DonationStatus } from '../donation-status.enum';
import { Message } from './message.entity';
 
@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
 
  @ManyToOne(() => Need, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'need_id' })
  need: Need;
 
  @ManyToOne(() => Ong, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ong_id' })
  ong: Ong;
 
  @Column({ type: 'int' })
  quantity: number;
 
  @Column({ type: 'varchar', enum: DonationStatus, default: DonationStatus.PENDING })
  status: DonationStatus;
 
  @OneToMany(() => Message, (message) => message.donation, { cascade: true })
  messages: Message[];
 
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
 
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}