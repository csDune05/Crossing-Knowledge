import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type ListeningComprehensionQuestion = {
  audio: string;
  options: string[];
  correctOptionIndex: number;
};

@Entity()
export class ListeningComprehensionExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  questions: ListeningComprehensionQuestion[]; // Multiple questions per exercise
}
