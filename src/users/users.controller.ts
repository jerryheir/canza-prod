import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  BadRequestException,
  UnauthorizedException,
  Req,
  Res,
  Param,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  EditProfileDto,
} from './dto/users.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { API_VERSION } from '../config';
import { Request, Response } from 'express';
import { verificationDone } from 'src/users/templates/verifyEmail';
import { generateRandomHash } from 'src/helpers';

@Controller(`${API_VERSION}`)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const data = await this.usersService.findOne({ email: registerDto.email });
    if (data) {
      throw new BadRequestException('User already exists');
    }
    await this.usersService.registerService({
      ...registerDto,
      password: hashedPassword,
    });
    return {
      status: 'success',
      message: 'Registration successful',
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.findOne({ email: loginDto.email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwt = this.jwtService.signAsync({ id: user.id, email: user.email });
    response.cookie('x-token', jwt, { httpOnly: true });
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

  @Get('users/:id')
  async getUser(@Req() request: Request, @Param() id: number) {
    try {
      const cookie = request.cookies['x-token'];
      const result = await this.jwtService.verifyAsync(cookie);
      if (!result) {
        Logger.log('No token');
        throw new UnauthorizedException();
      }
      const user = await this.usersService.findOne({ id });
      return {
        status: 'success',
        message: 'Retrieved successfully',
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          image_url: user.image_url,
          google_signin: user.google_signin,
        },
      };
    } catch (err: any) {
      throw new UnauthorizedException();
    }
  }

  @Get('users')
  async getUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('confirmation_code/:token')
  async confirm(@Res() response: Response, @Param() token: string) {
    try {
      const result = await this.jwtService.verifyAsync(token);
      if (result && result.id) {
        await this.usersService.findAndUpdate({
          id: result.id,
          verified: true,
        });
        return response.send(verificationDone);
      } else {
        return response.send('An Error occurred. Please try again later!');
      }
    } catch (err: any) {
      throw new UnauthorizedException();
    }
  }

  @Post('reset')
  async resetPassword(@Body('email') email: string) {
    try {
      const user = await this.usersService.findOne({ email });
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      const randomHash = generateRandomHash(11);
      const hashedPassword = await bcrypt.hash(randomHash, 12);
      await this.usersService.forgotPassword(email, randomHash);
      await this.usersService.findAndUpdate({
        email,
        password: hashedPassword,
      });
      return {
        status: 'success',
        message: 'An email has been sent!',
      };
    } catch (err: any) {
      throw new ForbiddenException('Denied Access!');
    }
  }

  @Put('change-password')
  async changePassword(
    @Body() changeDto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.findOne({ email: changeDto.email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!(await bcrypt.compare(changeDto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const hashedPassword = await bcrypt.hash(changeDto.newPassword, 12);
    await this.usersService.findAndUpdate({
      email: changeDto.email,
      password: hashedPassword,
    });
    const jwt = this.jwtService.signAsync({ id: user.id, email: user.email });
    response.cookie('x-token', jwt, { httpOnly: true });
    return {
      status: 'success',
      message: 'Password change successful',
      data: {
        token: jwt,
      },
    };
  }

  @Put('edit-profile/:id')
  async editUser(@Body() editDto: EditProfileDto, @Param('id') id: string) {
    const user = await this.usersService.findOne({
      id: id,
      email: editDto.email,
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    await this.usersService.findAndUpdate({
      firstname: editDto.firstname,
      lastname: editDto.lastname,
    });
    return {
      status: 'success',
      message: 'Profile updated successfully',
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('x-token');
    return {
      status: 'success',
      message: 'Log out successful',
    };
  }
}
