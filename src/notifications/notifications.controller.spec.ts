import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
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

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
