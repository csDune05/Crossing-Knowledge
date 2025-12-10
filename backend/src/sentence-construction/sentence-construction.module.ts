import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentenceConstructionController } from './sentence-construction.controller';
import { SentenceConstructionService } from './sentence-construction.service';
import { SentenceConstructionExercise } from './entities/sentence-construction-exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SentenceConstructionExercise])],
  controllers: [SentenceConstructionController],
  providers: [SentenceConstructionService],
})
export class SentenceConstructionModule {}
