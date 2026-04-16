import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Donation } from './donation.entity';
 
export type SenderType = 'user' | 'ong';
 
@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @ManyToOne(() => Donation, (donation) => donation.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'donation_id' })
  donation: Donation;
 
  @Column({ name: 'sender_id' })
  senderId: string;
 
  @Column({ name: 'sender_type', type: 'varchar' })
  senderType: SenderType;
 
  @Column({ type: 'text' })
  content: string;
 
  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;
}