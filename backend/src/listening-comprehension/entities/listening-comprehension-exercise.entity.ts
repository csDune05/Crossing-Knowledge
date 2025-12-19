import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'listening_comprehension_item' })
export class ListeningComprehensionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  option1: string;

  @Column()
  option2: string;

  @Column()
  audio: string;
}
