import { Test, TestingModule } from '@nestjs/testing';
import { ListeningComprehensionService } from './listening-comprehension.service';

describe('ListeningComprehensionService', () => {
  let service: ListeningComprehensionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListeningComprehensionService],
    }).compile();

    service = module.get<ListeningComprehensionService>(ListeningComprehensionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
