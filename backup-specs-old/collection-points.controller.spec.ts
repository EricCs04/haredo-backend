import { Test, TestingModule } from '@nestjs/testing';
import { CollectionPointsController } from './collection-points.controller';

describe('CollectionPointsController', () => {
  let controller: CollectionPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionPointsController],
    }).compile();

    controller = module.get<CollectionPointsController>(CollectionPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
