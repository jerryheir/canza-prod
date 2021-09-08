import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Registered', registerDto);
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    return this.usersService.registerService({
      ...registerDto,
      password: hashedPassword,
    });
  }
  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }
}
