import { Test, TestingModule } from '@nestjs/testing';
import { IngressosService } from './ingressos.service';

describe('IngressosService', () => {
  let service: IngressosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngressosService],
    }).compile();

    service = module.get<IngressosService>(IngressosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
