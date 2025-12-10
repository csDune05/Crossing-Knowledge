import { Test, TestingModule } from '@nestjs/testing';
import { SentenceConstructionController } from './sentence-construction.controller';

describe('SentenceConstructionController', () => {
  let controller: SentenceConstructionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentenceConstructionController],
    }).compile();

    controller = module.get<SentenceConstructionController>(SentenceConstructionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
