import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Ong } from '../../ongs/entities/ong.entity';
import { NeedStatus } from '../need-status.enum';
import { NeedPriority } from '../need-priority.enum';

@Entity('needs')
export class Need {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Ong, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'ong_id' })
  ong!: Ong;

  @Column()
  title!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string;

  @Column()
  category!: string;

  @Column({
    type: 'varchar',
    enum: NeedPriority,
    default: NeedPriority.MEDIUM,
  })
  priority!: NeedPriority;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deadline!: Date;

  @Column({ type: 'int', name: 'quantity_needed' })
  quantityNeeded!: number;

  @Column({ type: 'int', name: 'quantity_received', default: 0 })
  quantityReceived!: number;

  @Column({
    type: 'varchar',
    enum: NeedStatus,
    default: NeedStatus.OPEN,
  })
  status!: NeedStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ nullable: true })
  completionMessage?: string;

  @Column('text', { array: true, nullable: true })
  images?: string[];
}