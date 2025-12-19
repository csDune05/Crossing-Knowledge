import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListeningComprehensionItem } from './entities/listening-comprehension-exercise.entity';
import { CreateListeningItemDto } from './dto/create-item.dto';
import { UpdateListeningItemDto } from './dto/update-item.dto';
import { SubmitListeningDto } from './dto/submit.dto';

@Injectable()
export class ListeningComprehensionService {
  constructor(
    @InjectRepository(ListeningComprehensionItem)
    private readonly repo: Repository<ListeningComprehensionItem>,
  ) {}

  async create(dto: CreateListeningItemDto) {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOneOrThrow(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }

  async findOne(id: number) {
    return this.findOneOrThrow(id);
  }

  async update(id: number, dto: UpdateListeningItemDto) {
    await this.findOneOrThrow(id);
    await this.repo.update({ id }, dto);
    return this.findOneOrThrow(id);
  }

  async remove(id: number) {
    const item = await this.findOneOrThrow(id);
    await this.repo.remove(item);
    return { deleted: true };
  }

  async submit(dto: SubmitListeningDto) {
    const item = await this.findOneOrThrow(dto.itemId);

    const correctOption: 1 | 2 = 1; 
    const correctText = item.option1;

    const correct = dto.selectedOption === correctOption;

    return { correct, correctOption, correctText };
  }
}
