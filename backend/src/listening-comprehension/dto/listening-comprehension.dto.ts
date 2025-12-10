import { Type } from 'class-transformer';
import { IsString, IsArray, ArrayMinSize, ArrayMaxSize, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateListeningComprehensionDto {
  @IsString()
  audio: string; // URL to the audio for the question

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5) // Assuming 2 to 5 options for a multiple choice
  options: string[]; // Possible answer options

  @IsNumber()
  @Type(() => Number)
  correctOptionIndex: number; // Index of the correct option in the options array
}

export class UpdateListeningComprehensionDto extends PartialType(
  CreateListeningComprehensionDto,
) {}

export class SubmitListeningComprehensionDto {
  @IsNumber()
  @Type(() => Number)
  exerciseId: number;

  @IsNumber()
  @Type(() => Number)
  selectedOptionIndex: number; // Index of the option selected by the user
}
