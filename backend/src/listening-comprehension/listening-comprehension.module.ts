import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningComprehensionController } from './listening-comprehension.controller';
import { ListeningComprehensionService } from './listening-comprehension.service';
import { ListeningComprehensionExercise } from './entities/listening-comprehension-exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListeningComprehensionExercise])],
  controllers: [ListeningComprehensionController],
  providers: [ListeningComprehensionService],
})
export class ListeningComprehensionModule {}
