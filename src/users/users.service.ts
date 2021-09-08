import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
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
    return await this.usersRepository.save({ ...registerDto, role: 'user' });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  findOne(id: number): User {
    return this.items.find((item) => item.id === id);
  }
}
