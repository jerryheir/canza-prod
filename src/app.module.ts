import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { User } from './users/users.entity';
import { Coins, SupportedCoins } from './coins/coins.entity';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { LocationController } from './location/location.controller';
import { LocationService } from './location/location.service';
import { Location } from './location/location.entity';
import { CoinsController } from './coins/coins.controller';
import { OrdersController } from './orders/orders.controller';
import { TransactionsController } from './transactions/transactions.controller';
import { NotificationsController } from './notifications/notifications.controller';
import { CoinsService } from './coins/coins.service';
import { OrdersService } from './orders/orders.service';
import { TransactionsService } from './transactions/transactions.service';
import { NotificationsService } from './notifications/notifications.service';
import { IssueController } from './issue/issue.controller';
import { IssueService } from './issue/issue.service';
import { Orders } from './orders/orders.entity';
import { Notifications } from './notifications/notifications.entity';
import { Issue } from './issue/issue.entity';
import { Transactions } from './transactions/transactions.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DATABASE_HOST'),
        port: config.get('DATABASE_PORT'),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [
          User,
          Location,
          Coins,
          SupportedCoins,
          Orders,
          Notifications,
          Issue,
          Transactions,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Location,
      Coins,
      SupportedCoins,
      Orders,
      Notifications,
      Issue,
      Transactions,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRE_TIME') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    UsersController,
    LocationController,
    CoinsController,
    OrdersController,
    TransactionsController,
    NotificationsController,
    IssueController,
  ],
  providers: [
    UsersService,
    LocationService,
    CoinsService,
    OrdersService,
    TransactionsService,
    NotificationsService,
    IssueService,
  ],
})
export class AppModule {}
