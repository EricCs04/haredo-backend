import { Test, TestingModule } from '@nestjs/testing';
import { CollectionPointsService } from './collection-points.service';

describe('CollectionPointsService', () => {
  let service: CollectionPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionPointsService],
    }).compile();

    service = module.get<CollectionPointsService>(CollectionPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
