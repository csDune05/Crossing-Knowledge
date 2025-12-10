import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  module: string; // e.g., "vocabulary", "pronunciation"

  @Column()
  score: number;

  @CreateDateColumn()
  date: Date;
}
