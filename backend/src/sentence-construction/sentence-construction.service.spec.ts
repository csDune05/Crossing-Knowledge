import { Test, TestingModule } from '@nestjs/testing';
import { SentenceConstructionService } from './sentence-construction.service';

describe('SentenceConstructionService', () => {
  let service: SentenceConstructionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentenceConstructionService],
    }).compile();

    service = module.get<SentenceConstructionService>(SentenceConstructionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
