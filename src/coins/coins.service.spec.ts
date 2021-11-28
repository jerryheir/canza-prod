import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CoinsService } from './coins.service';

describe('CoinsService', () => {
  let service: CoinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoinsService,
        {
          provide: 'CoinsRepository',
          useClass: Repository,
        },
        {
          provide: 'SupportedCoinsRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CoinsService>(CoinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
