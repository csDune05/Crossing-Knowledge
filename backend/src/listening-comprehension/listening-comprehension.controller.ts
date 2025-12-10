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
import { ListeningComprehensionService } from './listening-comprehension.service';
import {
  CreateListeningComprehensionDto,
  SubmitListeningComprehensionDto,
  UpdateListeningComprehensionDto,
} from './dto/listening-comprehension.dto';

@Controller('listening-comprehension')
export class ListeningComprehensionController {
  constructor(
    private readonly listeningComprehensionService: ListeningComprehensionService,
  ) {}

  @Post('exercises')
  create(@Body() createDto: CreateListeningComprehensionDto) {
    return this.listeningComprehensionService.create(createDto);
  }

  @Get('exercises')
  findAll() {
    return this.listeningComprehensionService.findAll();
  }

  @Get('exercises/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listeningComprehensionService.findOne(id);
  }

  @Patch('exercises/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateListeningComprehensionDto,
  ) {
    return this.listeningComprehensionService.update(id, updateDto);
  }

  @Delete('exercises/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.listeningComprehensionService.remove(id);
  }

  @Post('submit')
  submit(@Body() submitDto: SubmitListeningComprehensionDto) {
    return this.listeningComprehensionService.submit(submitDto);
  }
}
