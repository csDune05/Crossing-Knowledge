import { Test, TestingModule } from '@nestjs/testing';
import { ListeningComprehensionController } from './listening-comprehension.controller';

describe('ListeningComprehensionController', () => {
  let controller: ListeningComprehensionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListeningComprehensionController],
    }).compile();

    controller = module.get<ListeningComprehensionController>(ListeningComprehensionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
