import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class ListeningComprehensionQuestionDto {
  @IsString()
  audio: string; // URL to the audio for the question

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5) // Assuming 2 to 5 options for a multiple choice
  @IsString({ each: true })
  options: string[]; // Possible answer options

  @IsInt()
  @Min(0)
  @Type(() => Number)
  correctOptionIndex: number; // Index of the correct option in the options array
}

export class CreateListeningComprehensionDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ListeningComprehensionQuestionDto)
  questions: ListeningComprehensionQuestionDto[]; // One exercise can include multiple questions
}

export class UpdateListeningComprehensionDto extends PartialType(
  CreateListeningComprehensionDto,
) {}

export class SubmitListeningComprehensionDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  exerciseId: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  questionIndex: number; // Index of the question being answered

  @IsInt()
  @Min(0)
  @Type(() => Number)
  selectedOptionIndex: number; // Index of the option selected by the user
}
