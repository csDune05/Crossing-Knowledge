import { IsString, IsUrl, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateVocabularyDto {
  @IsString()
  word: string;

  @IsUrl()
  image: string; // URL to the image

  @IsUrl()
  audio: string; // URL to the audio pronunciation

  @IsString()
  topic: string;
}

export class UpdateVocabularyDto extends PartialType(CreateVocabularyDto) {}
