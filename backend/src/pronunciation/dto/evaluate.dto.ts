import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EvaluatePronunciationDto {
  @IsString()
  expectedText: string;

  @IsString()
  spokenText: string;
}

export class EvaluatePronunciationResponseDto {
  @IsString()
  result: 'correct' | 'close' | 'wrong';

  @IsNumber()
  @Type(() => Number)
  score: number; // 0-100

  @IsString()
  hint: string;

  @IsOptional()
  @IsString()
  correctedSpoken?: string;
}
