import { Controller, Post, Body } from '@nestjs/common';
import { PronunciationService } from './pronunciation.service';
import { CreatePronunciationPracticeDto } from './dto/pronunciation.dto';
import { EvaluatePronunciationDto } from './dto/evaluate.dto';

@Controller('pronunciation')
export class PronunciationController {
  constructor(private readonly pronunciationService: PronunciationService) {}

  @Post('practice')
  create(@Body() dto: CreatePronunciationPracticeDto) {
    return this.pronunciationService.create(dto);
  }

  @Post('evaluate')
  evaluate(@Body() evaluateDto: EvaluatePronunciationDto) {
    return this.pronunciationService.evaluate(evaluateDto);
  }
}
