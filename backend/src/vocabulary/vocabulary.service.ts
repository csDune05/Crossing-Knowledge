import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVocabularyDto, UpdateVocabularyDto } from './dto/vocabulary.dto';
import { Vocabulary } from './entities/vocabulary.entity';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private readonly vocabularyRepository: Repository<Vocabulary>,
  ) {}

  private toGithubRaw(url?: string | null) {
    if (!url) return url ?? '';
    if (url.includes('github.com') && url.includes('/blob/')) {
      return url
        .replace('https://github.com/', 'https://raw.githubusercontent.com/')
        .replace('/blob/', '/');
    }
    return url;
  }

  private normalize(item: Vocabulary): Vocabulary {
    return {
      ...item,
      image: this.toGithubRaw(item.image),
      audio: this.toGithubRaw(item.audio),
    };
  }

  async create(createVocabularyDto: CreateVocabularyDto) {
    const payload: CreateVocabularyDto = {
      ...createVocabularyDto,
      image: this.toGithubRaw(createVocabularyDto.image),
      audio: this.toGithubRaw(createVocabularyDto.audio),
    };

    const vocabulary = this.vocabularyRepository.create(payload);
    const saved = await this.vocabularyRepository.save(vocabulary);
    return this.normalize(saved);
  }

  async findAll() {
    const items = await this.vocabularyRepository.find();
    return items.map((i) => this.normalize(i));
  }

  async findByTopic(topic: string) {
    const items = await this.vocabularyRepository.findBy({ topic });
    return items.map((i) => this.normalize(i));
  }

  async findOne(id: number) {
    const item = await this.vocabularyRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`Vocabulary id=${id} not found`);
    return this.normalize(item);
  }

  async update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    const payload: UpdateVocabularyDto = {
      ...updateVocabularyDto,
      ...(updateVocabularyDto.image && { image: this.toGithubRaw(updateVocabularyDto.image) }),
      ...(updateVocabularyDto.audio && { audio: this.toGithubRaw(updateVocabularyDto.audio) }),
    };

    await this.vocabularyRepository.update(id, payload);

    const updated = await this.vocabularyRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException(`Vocabulary id=${id} not found`);
    return this.normalize(updated);
  }

  async remove(id: number) {
    const found = await this.vocabularyRepository.findOneBy({ id });
    if (!found) throw new NotFoundException(`Vocabulary id=${id} not found`);
    await this.vocabularyRepository.delete(id);
    return { deleted: true };
  }
}
