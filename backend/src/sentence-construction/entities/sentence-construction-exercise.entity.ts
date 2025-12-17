import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SentenceConstructionExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  scrambledWords: string[]; // Words in scrambled order

  @Column('simple-json')
  correctSentences: string[]; // Acceptable correct sentences

  @Column()
  level: string; // e.g., "easy", "medium", "hard"
}
