import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProgressDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsString()
  module: string; // e.g., "vocabulary", "pronunciation"

  @IsNumber()
  @Type(() => Number)
  score: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class UpdateProgressDto extends PartialType(CreateProgressDto) {}

export class GetProgressQueryDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
