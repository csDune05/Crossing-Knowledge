import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePronunciationPracticeDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsNumber()
  @Type(() => Number)
  wordId: number; // The word the user is practicing

  @IsString()
  audioFile: string; // URL or base64 encoded audio file
}

export class UpdatePronunciationPracticeDto extends PartialType(
  CreatePronunciationPracticeDto,
) {}

export class PronunciationResultDto {
  @IsNumber()
  score: number; // e.g., 0-100

  @IsString()
  feedback: string; // Textual feedback
}
