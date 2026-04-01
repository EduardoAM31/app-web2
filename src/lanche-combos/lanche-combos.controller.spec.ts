import { Test, TestingModule } from '@nestjs/testing';
import { LancheCombosController } from './lanche-combos.controller';

describe('LancheCombosController', () => {
  let controller: LancheCombosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LancheCombosController],
    }).compile();

    controller = module.get<LancheCombosController>(LancheCombosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
