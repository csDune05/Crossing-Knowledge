import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto, GetProgressQueryDto } from './dto/progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get()
  findAll(@Query() query: GetProgressQueryDto) {
    return this.progressService.findAll(query);
  }
}
