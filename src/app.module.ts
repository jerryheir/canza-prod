import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { User } from './users/users.entity';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { LocationController } from './location/location.controller';
import { LocationService } from './location/location.service';
import { Location } from './location/location.entity';

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
        // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
        entities: [User, Location],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Location]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRE_TIME') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController, LocationController],
  providers: [UsersService, LocationService],
})
export class AppModule {}
