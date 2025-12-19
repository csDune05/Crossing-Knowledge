import { IsIn, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitListeningDto {
  @IsNumber()
  @Type(() => Number)
  itemId: number;

  @IsIn([1, 2])
  selectedOption: 1 | 2;
}
