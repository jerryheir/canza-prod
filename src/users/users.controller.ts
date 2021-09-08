import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/users.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { API_VERSION } from 'src/config';

@Controller(`${API_VERSION}`)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.findOne({ email: registerDto.email });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return this.usersService.registerService({
      ...registerDto,
      password: hashedPassword,
    });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findOne({ email: loginDto.email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwt = this.jwtService.signAsync({ id: user.id, email: user.email });
    return {
      status: 'success',
      message: 'Log in successful',
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        image_url: user.image_url,
        token: jwt,
      },
    };
  }

  @Get('users')
  async getUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }
}
