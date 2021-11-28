import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            createTransactions: jest.fn(),
            getMyTransactions: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            getUser: jest.fn(),
            getUsers: jest.fn(),
            confirm: jest.fn(),
            requestReset: jest.fn(),
            resetPassword: jest.fn(),
            changePassword: jest.fn(),
            editUser: jest.fn(),
            upload: jest.fn(),
            logout: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
            verifyAsync: jest.fn(),
            sign: jest.fn(),
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
