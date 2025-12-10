import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SentenceConstructionService } from './sentence-construction.service';
import {
  CreateSentenceConstructionDto,
  SubmitSentenceConstructionDto,
  UpdateSentenceConstructionDto,
} from './dto/sentence-construction.dto';

@Controller('sentence-construction')
export class SentenceConstructionController {
  constructor(
    private readonly sentenceConstructionService: SentenceConstructionService,
  ) {}

  @Post('exercises')
  create(@Body() createDto: CreateSentenceConstructionDto) {
    return this.sentenceConstructionService.create(createDto);
  }

  @Get('exercises')
  findAll() {
    return this.sentenceConstructionService.findAll();
  }

  @Get('exercises/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sentenceConstructionService.findOne(id);
  }

  @Patch('exercises/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSentenceConstructionDto,
  ) {
    return this.sentenceConstructionService.update(id, updateDto);
  }

  @Delete('exercises/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sentenceConstructionService.remove(id);
  }

  @Post('submit')
  submit(@Body() submitDto: SubmitSentenceConstructionDto) {
    return this.sentenceConstructionService.submit(submitDto);
  }
}
