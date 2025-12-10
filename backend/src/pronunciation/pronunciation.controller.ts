import { Controller, Post, Body } from '@nestjs/common';
import { PronunciationService } from './pronunciation.service';
import { CreatePronunciationPracticeDto } from './dto/pronunciation.dto';

@Controller('pronunciation')
export class PronunciationController {
  constructor(private readonly pronunciationService: PronunciationService) {}

  @Post('practice')
  create(@Body() createPronunciationPracticeDto: CreatePronunciationPracticeDto) {
    return this.pronunciationService.create(createPronunciationPracticeDto);
  }
}
