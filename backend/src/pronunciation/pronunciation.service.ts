import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePronunciationPracticeDto } from './dto/pronunciation.dto';
import { PronunciationPractice } from './entities/pronunciation-practice.entity';

@Injectable()
export class PronunciationService {
  constructor(
    @InjectRepository(PronunciationPractice)
    private readonly pronunciationPracticeRepository: Repository<PronunciationPractice>,
  ) {}

  async create(
    createPronunciationPracticeDto: CreatePronunciationPracticeDto,
  ): Promise<PronunciationPractice> {
    // In a real app, you would fetch the user and word entities
    // and handle the audio file upload/storage.
    // For now, we'll just create a record with a dummy score.
    const practice = this.pronunciationPracticeRepository.create({
      ...createPronunciationPracticeDto,
      user: { id: createPronunciationPracticeDto.userId } as any,
      word: { id: createPronunciationPracticeDto.wordId } as any,
      score: Math.floor(Math.random() * 101), // Dummy score
    });

    return this.pronunciationPracticeRepository.save(practice);
  }
}
