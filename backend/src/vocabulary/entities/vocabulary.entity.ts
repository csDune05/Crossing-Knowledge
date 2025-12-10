import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Vocabulary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column()
  image: string; // URL to the image

  @Column()
  audio: string; // URL to the audio pronunciation

  @Column()
  topic: string;
}
