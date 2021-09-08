import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/users.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  private readonly items: User[] = [
    {
      id: 1,
      firstname: 'Jerry',
      lastname: 'Heir',
      email: 'nwaezejerry@gmail.com',
      password: null,
      image_url: null,
      role: 'user',
      google_signin: 0,
    },
  ];

  async registerService(registerDto: RegisterDto): Promise<RegisterDto & User> {
    return await this.usersRepository.save({
      ...registerDto,
      role: 'user',
      google_signin: 0,
    });
  }

  async findAll(): Promise<User[]> {
    Logger.log(this.configService.get('API_VERSION'));
    return await this.usersRepository.find();
  }

  async findOne(object: any): Promise<User> {
    return await this.usersRepository.findOne(object);
  }
}
