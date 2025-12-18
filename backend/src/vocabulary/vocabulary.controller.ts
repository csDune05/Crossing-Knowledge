import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import {
  CreateVocabularyDto,
  UpdateVocabularyDto,
} from './dto/vocabulary.dto';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  create(@Body() createVocabularyDto: CreateVocabularyDto) {
    return this.vocabularyService.create(createVocabularyDto);
  }

  @Get()
  findAll(@Query('topic') topic?: string) {
    if (topic) {
      return this.vocabularyService.findByTopic(topic);
    }
    return this.vocabularyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vocabularyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
  ) {
    return this.vocabularyService.update(id, updateVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vocabularyService.remove(id);
  }
}
