import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ListeningComprehensionExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  audio: string; // URL to the audio for the question

  @Column('simple-array')
  options: string[]; // Possible answer options

  @Column()
  correctOptionIndex: number; // Index of the correct option in the options array
}
