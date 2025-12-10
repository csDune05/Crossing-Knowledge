import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SentenceConstructionExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  scrambledWords: string[]; // Words in scrambled order

  @Column()
  correctSentence: string; // The correct sentence

  @Column()
  level: string; // e.g., "easy", "medium", "hard"
}
