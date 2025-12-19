import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeningComprehensionController } from './listening-comprehension.controller';
import { ListeningComprehensionService } from './listening-comprehension.service';
import { ListeningComprehensionItem } from './entities/listening-comprehension-exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListeningComprehensionItem])],
  controllers: [ListeningComprehensionController],
  providers: [ListeningComprehensionService],
})
export class ListeningComprehensionModule {}
