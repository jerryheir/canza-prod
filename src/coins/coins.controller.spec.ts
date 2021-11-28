import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';

describe('CoinsController', () => {
  let controller: CoinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoinsController],
      providers: [
        {
          provide: CoinsService,
          useValue: {
            getCoins: jest.fn(),
            getSwapRate: jest.fn(),
            getCoinGeckoCurrencies: jest.fn(),
            getSupportedCoins: jest.fn(),
            createSupportedCoins: jest.fn(),
            updateSupportedCoins: jest.fn(),
            requestSwapToken: jest.fn(),
            sendCoin: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            getMyNotifications: jest.fn(),
            createNotifications: jest.fn(),
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

    controller = module.get<CoinsController>(CoinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
