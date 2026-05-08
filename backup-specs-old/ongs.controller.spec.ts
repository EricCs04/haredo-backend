import { Test, TestingModule } from '@nestjs/testing';
import { OngsController } from './ongs.controller';

describe('OngsController', () => {
  let controller: OngsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OngsController],
    }).compile();

    controller = module.get<OngsController>(OngsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
