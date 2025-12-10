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
    this.ensureValidOptionIndex(
      createDto.options,
      createDto.correctOptionIndex,
    );
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
    const options = updateDto.options ?? existing.options;
    const correctIndex =
      updateDto.correctOptionIndex ?? existing.correctOptionIndex;

    this.ensureValidOptionIndex(options, correctIndex);

    await this.exerciseRepository.update(id, {
      ...updateDto,
      options,
      correctOptionIndex: correctIndex,
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
  ): Promise<{ correct: boolean; correctOptionIndex: number }> {
    const exercise = await this.findOneOrThrow(submitDto.exerciseId);

    const correct =
      exercise.correctOptionIndex === submitDto.selectedOptionIndex;
    // In a real app, you would also save the user's progress.
    return { correct, correctOptionIndex: exercise.correctOptionIndex };
  }

  private ensureValidOptionIndex(options: string[], index: number) {
    if (index < 0 || index >= options.length) {
      throw new BadRequestException('Correct option index is out of bounds');
    }
  }

  private async findOneOrThrow(id: number) {
    const exercise = await this.exerciseRepository.findOneBy({ id });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }
}
