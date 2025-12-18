import { PartialType } from '@nestjs/mapped-types';
import { CreateListeningItemDto } from './create-item.dto';

export class UpdateListeningItemDto extends PartialType(CreateListeningItemDto) {}
