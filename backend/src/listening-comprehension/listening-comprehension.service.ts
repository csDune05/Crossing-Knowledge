import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateListeningComprehensionDto,
  SubmitListeningComprehensionDto,
  UpdateListeningComprehensionDto,
} from './dto/listening-comprehension.dto';
import { ListeningComprehensionExercise } from './entities/listening-comprehension-exercise.entity';

@Injectable()
export class ListeningComprehensionService {
  constructor(
    @InjectRepository(ListeningComprehensionExercise)
    private readonly exerciseRepository: Repository<ListeningComprehensionExercise>,
  ) {}

  create(createDto: CreateListeningComprehensionDto) {
    this.ensureValidQuestions(createDto.questions);
    const exercise = this.exerciseRepository.create(createDto);
    return this.exerciseRepository.save(exercise);
  }

  findAll() {
    return this.exerciseRepository.find();
  }

  async findOne(id: number) {
    return this.findOneOrThrow(id);
  }

  async update(id: number, updateDto: UpdateListeningComprehensionDto) {
    const existing = await this.findOneOrThrow(id);
    const questions = updateDto.questions ?? existing.questions;
    this.ensureValidQuestions(questions);

    await this.exerciseRepository.update(id, {
      ...updateDto,
      questions,
    });

    return this.findOneOrThrow(id);
  }

  async remove(id: number) {
    const existing = await this.findOneOrThrow(id);
    await this.exerciseRepository.remove(existing);
    return { deleted: true };
  }

  async submit(
    submitDto: SubmitListeningComprehensionDto,
  ): Promise<{ correct: boolean; correctOptionIndex: number; questionIndex: number }> {
    const exercise = await this.findOneOrThrow(submitDto.exerciseId);
    const question = exercise.questions[submitDto.questionIndex];
    if (!question) {
      throw new BadRequestException('Question index is out of bounds');
    }
    if (
      submitDto.selectedOptionIndex < 0 ||
      submitDto.selectedOptionIndex >= question.options.length
    ) {
      throw new BadRequestException('Selected option index is out of bounds');
    }

    const correct =
      question.correctOptionIndex === submitDto.selectedOptionIndex;
    // In a real app, you would also save the user's progress.
    return {
      correct,
      correctOptionIndex: question.correctOptionIndex,
      questionIndex: submitDto.questionIndex,
    };
  }

  private ensureValidQuestions(questions: { options: string[]; correctOptionIndex: number }[]) {
    questions.forEach((question, index) => {
      if (
        question.correctOptionIndex < 0 ||
        question.correctOptionIndex >= question.options.length
      ) {
        throw new BadRequestException(
          `Correct option index is out of bounds for question ${index}`,
        );
      }
    });
  }

  private async findOneOrThrow(id: number) {
    const exercise = await this.exerciseRepository.findOneBy({ id });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }
}
