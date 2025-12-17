import { Type } from 'class-transformer';
import { IsString, IsArray, ArrayMinSize, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSentenceConstructionDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  scrambledWords: string[]; // Words in scrambled order

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  correctSentences: string[]; // Acceptable correct sentences

  @IsString()
  level: string; // e.g., "easy", "medium", "hard"
}

export class UpdateSentenceConstructionDto extends PartialType(
  CreateSentenceConstructionDto,
) {}

export class SubmitSentenceConstructionDto {
  @IsNumber()
  @Type(() => Number)
  exerciseId: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  submittedWords: string[]; // Words submitted by the user in order
}
