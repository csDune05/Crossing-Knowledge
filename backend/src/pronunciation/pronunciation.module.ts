import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PronunciationController } from './pronunciation.controller';
import { PronunciationService } from './pronunciation.service';
import { PronunciationPractice } from './entities/pronunciation-practice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PronunciationPractice])],
  controllers: [PronunciationController],
  providers: [PronunciationService],
})
export class PronunciationModule {}
