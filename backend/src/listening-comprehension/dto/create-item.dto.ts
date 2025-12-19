import { IsString } from 'class-validator';

export class CreateListeningItemDto {
  @IsString()
  option1: string;

  @IsString()
  option2: string;

  @IsString()
  audio: string;
}
