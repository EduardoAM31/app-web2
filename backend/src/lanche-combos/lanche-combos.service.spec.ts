import { Test, TestingModule } from '@nestjs/testing';
import { LancheCombosService } from './lanche-combos.service';

describe('LancheCombosService', () => {
  let service: LancheCombosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LancheCombosService],
    }).compile();

    service = module.get<LancheCombosService>(LancheCombosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
