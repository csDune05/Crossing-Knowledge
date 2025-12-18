import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ListeningComprehensionService } from './listening-comprehension.service';
import { CreateListeningItemDto } from './dto/create-item.dto';
import { UpdateListeningItemDto } from './dto/update-item.dto';
import { SubmitListeningDto } from './dto/submit.dto';

@Controller('listening-comprehension')
export class ListeningComprehensionController {
  constructor(private readonly service: ListeningComprehensionService) {}

  // CRUD items
  @Post('items')
  create(@Body() dto: CreateListeningItemDto) {
    return this.service.create(dto);
  }

  @Get('items')
  findAll() {
    return this.service.findAll();
  }

  @Get('items/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch('items/:id')
  update(@Param('id') id: string, @Body() dto: UpdateListeningItemDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete('items/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  // submit answer
  @Post('submit')
  submit(@Body() dto: SubmitListeningDto) {
    return this.service.submit(dto);
  }
}
