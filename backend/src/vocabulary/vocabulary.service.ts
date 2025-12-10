import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateVocabularyDto,
  UpdateVocabularyDto,
} from './dto/vocabulary.dto';
import { Vocabulary } from './entities/vocabulary.entity';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private readonly vocabularyRepository: Repository<Vocabulary>,
  ) {}

  create(createVocabularyDto: CreateVocabularyDto) {
    const vocabulary = this.vocabularyRepository.create(createVocabularyDto);
    return this.vocabularyRepository.save(vocabulary);
  }

  findAll() {
    return this.vocabularyRepository.find();
  }

  findOne(id: number) {
    return this.vocabularyRepository.findOneBy({ id });
  }

  async update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    await this.vocabularyRepository.update(id, updateVocabularyDto);
    return this.vocabularyRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.vocabularyRepository.delete(id);
  }
}
