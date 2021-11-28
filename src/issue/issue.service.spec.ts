import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { IssueService } from './issue.service';

describe('IssueService', () => {
  let service: IssueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssueService,
        {
          provide: 'IssueRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<IssueService>(IssueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
