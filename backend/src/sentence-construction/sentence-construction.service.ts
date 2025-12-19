import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateSentenceConstructionDto,
  SubmitSentenceConstructionDto,
  UpdateSentenceConstructionDto,
} from './dto/sentence-construction.dto';
import { SentenceConstructionExercise } from './entities/sentence-construction-exercise.entity';

@Injectable()
export class SentenceConstructionService {
  constructor(
    @InjectRepository(SentenceConstructionExercise)
    private readonly exerciseRepository: Repository<SentenceConstructionExercise>,
  ) {}

  create(createDto: CreateSentenceConstructionDto) {
    const exercise = this.exerciseRepository.create(createDto);
    return this.exerciseRepository.save(exercise);
  }

  findAll() {
    return this.exerciseRepository.find();
  }

  async findOne(id: number) {
    return this.findOneOrThrow(id);
  }

  async update(id: number, updateDto: UpdateSentenceConstructionDto) {
    await this.findOneOrThrow(id);
    await this.exerciseRepository.update(id, updateDto);
    return this.findOneOrThrow(id);
  }

  async remove(id: number) {
    const existing = await this.findOneOrThrow(id);
    await this.exerciseRepository.remove(existing);
    return { deleted: true };
  }

  async submit(
    submitDto: SubmitSentenceConstructionDto,
  ): Promise<{
    correct: boolean;
    correctSentence: string;
    correctSentences: string[];
  }> {
    const exercise = await this.findOneOrThrow(submitDto.exerciseId);
    const submittedSentence = submitDto.submittedWords.join(' ');

    const correct = exercise.correctSentences.includes(submittedSentence);
    // In a real app, you would also save the user's progress.
    return {
      correct,
      correctSentence: exercise.correctSentences[0],
      correctSentences: exercise.correctSentences,
    };
  }

  private async findOneOrThrow(id: number) {
    const exercise = await this.exerciseRepository.findOneBy({ id });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }
}
