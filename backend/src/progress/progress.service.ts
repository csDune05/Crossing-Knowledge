import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { CreateProgressDto, GetProgressQueryDto } from './dto/progress.dto';
import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
  ) {}

  create(createProgressDto: CreateProgressDto) {
    const { userId, date, ...rest } = createProgressDto;
    const progress = this.progressRepository.create({
      ...rest,
      user: { id: userId } as any,
      date: date ? new Date(date) : undefined,
    });
    return this.progressRepository.save(progress);
  }

  findAll(query: GetProgressQueryDto) {
    const { userId, startDate, endDate } = query;
    const dateFilter =
      startDate && endDate
        ? Between(new Date(startDate), new Date(endDate))
        : startDate
          ? MoreThanOrEqual(new Date(startDate))
          : endDate
            ? LessThanOrEqual(new Date(endDate))
            : undefined;

    return this.progressRepository.find({
      where: {
        user: { id: userId },
        date: dateFilter,
      },
      relations: ['user'],
      order: { date: 'DESC' },
    });
  }
}
