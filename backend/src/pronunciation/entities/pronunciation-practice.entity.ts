import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vocabulary } from '../../vocabulary/entities/vocabulary.entity';

@Entity()
export class PronunciationPractice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Vocabulary)
  word: Vocabulary;

  @Column()
  audioFile: string; // URL to the user's recorded audio

  @Column()
  score: number;
}
